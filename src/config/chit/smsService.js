import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";
import TopupRepository from "../../infrastructure/repositories/chit/topupRepository.js";
import config from "./env.js";

dotenv.config();

const PROVIDERS = {
  sms: {
    aurumm: {
      baseUrl: "http://sms.atts.in/api/sendmsg.php",
      params: {
        user: process.env.AURUMM_USER || "shanthijw",
        pass: process.env.AURUMM_PASS || "shanthijw",
        sender: "ATTSHT",
        priority: "ndnd",
        stype: "normal",
      },
    },
    shanthi: {
      baseUrl: "http://sms.atts.in/api/sendmsg.php",
      params: {
        user: process.env.SHANTHI_USER || "shanthijw",
        pass: process.env.SHANTHI_PASS || "shanthijw",
        sender: "ATTSTH",
        priority: "ndnd",
        stype: "normal",
      },
    },
  },
  whatsapp: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    },
  },
  push: {
    fcm: {
      serverKey: process.env.FCM_SERVER_KEY,
    },
  },
};

class NotificationService {
  constructor() {
    this.scheduledJobs = new Map();
    this.defaultProviders = {
      sms: Object.keys(PROVIDERS.sms)[0],
      whatsapp: Object.keys(PROVIDERS.whatsapp)[0],
      push: Object.keys(PROVIDERS.push)[0],
    };
  }

  setDefaultProvider(channel, provider) {
    if (!PROVIDERS[channel] || !PROVIDERS[channel][provider]) {
      throw new Error(`Invalid provider for ${channel}: ${provider}`);
    }
    this.defaultProviders[channel] = provider;
  }

  async sendNotification({
    channel,
    recipients,
    message,
    templateParams = {},
    provider,
    type,
    delayBetweenMessages = 1000,
    subject,
    customUrl,
    sendToAllSubscribed,
    title,
    imageUrl,
    whatsAppData,
  }) {
    try {
      if (!message) {
        message =
          type === "birthday"
            ? "Happy Birthday! 🎉"
            : type === "wedding"
              ? "Happy Anniversary! 💖"
              : "Notification";
      }

      const channelProviders = PROVIDERS[channel];
      if (!channelProviders) {
        throw new Error(`Unsupported channel: ${channel}`);
      }

      const providerType = provider || this.defaultProviders[channel];
      const providerConfig = channelProviders[providerType];

      const recipientList = Array.isArray(recipients)
        ? recipients
        : typeof recipients === "string"
          ? recipients
            .split("\n")
            .map((r) => r.trim())
            .filter((r) => r)
          : [String(recipients)];

      const interpolate = (template, params) => {
        if (!template) return "";
        return template.replace(
          /{{\s*(\w+)\s*}}/g,
          (_, key) => params[key] ?? ""
        );
      };

      const results = [];

      for (const recipient of recipientList) {
        const finalMessage = interpolate(
          channel === "sms" && type === "promotion"
            ? `${message}-ATTS`
            : message,
          templateParams
        );

        let result;
        try {
          switch (channel) {
            case "sms":
              result = await this._sendSMS(
                recipient,
                finalMessage,
                providerConfig,
                type,
                customUrl
              );
              break;
            case "whatsapp":
              result = await this._sendWhatsApp(whatsAppData);
              break;
            case "push":
              result = await this._sendPushNotification(
                recipient,
                finalMessage,
                type,
                sendToAllSubscribed,
                title,
                imageUrl
              );
              break;
            default:
              throw new Error(`Unsupported channel: ${channel}`);
          }

          results.push({
            channel,
            recipient,
            status: "success",
            ...result,
            type,
            provider: providerType,
            timestamp: new Date().toISOString(),
          });

          console.log(`[${type}] ${channel} sent to ${recipient}`);
        } catch (error) {
          results.push({
            channel,
            recipient,
            status: "failed",
            error: error.message,
            http_status: error.response?.status || null,
            server_response: error.response?.data || null,
            type,
            provider: providerType,
            timestamp: new Date().toISOString(),
          });
          console.log(error);
          console.error(
            `[${type}] Error sending ${channel} to ${recipient}:`,
            error.message
          );
        }

        if (delayBetweenMessages > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayBetweenMessages)
          );
        }
      }

      return results;
    } catch (error) {
      console.error("Error in sendNotification:", error);
      throw error;
    }
  }

  async _sendSMS(numbers, message, providerConfig, type, customUrl) {
    if (!Array.isArray(numbers)) {
      numbers = [numbers];
    }

    const CHUNK_SIZE = 100;
    const chunks = [];
    for (let i = 0; i < numbers.length; i += CHUNK_SIZE) {
      chunks.push(numbers.slice(i, i + CHUNK_SIZE));
    }

    let successCount = 0;
    let failureCount = 0;

    for (const chunk of chunks) {
      const promises = chunk.map(async (num) => {
        const number = num.toString().replace(/^91/, "");
        let url;

        try {
          if (customUrl) {
            url = customUrl
              .replace(/xxxmobilexxx/g, encodeURIComponent(number))
              .replace(/xxxmessagexxx/g, encodeURIComponent(message));
          } else {
            const params = new URLSearchParams({
              ...providerConfig.params,
              phone: number,
              text: message,
            });
            url = `${providerConfig.baseUrl}?${params.toString()}`;
          }

          console.log(url);
          const response = await axios.get(url);

          if (response.status === 200) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (err) {
          console.error(`SMS send failed for ${number}:`, err.message);
          failureCount++;
        }
      });

      await Promise.all(promises);
    }

    return {
      successCount,
      failureCount,
    };
  }

  async _sendWhatsApp(messageData) {
    try {
      const { phone, name, transactionId, amount, messageType, schemeName } = messageData;
      let parameters = [];

      switch (messageType) {
        case "scheme_account_creations":
          parameters = [
            { type: "text", text: name },
            { type: "text", text: schemeName }
          ];
          break;

        case "payment_completed":
          parameters = [
            { type: "text", text: name },
            { type: "text", text: amount },
            { type: "text", text: transactionId },
          ];
          break;

        default:
          throw new Error(`Unsupported message type: ${messageType}`);
      }

      // Final API body
      const body = {
        to: `91${phone}`,
        type: "template",
        template: {
          language: {
            policy: "deterministic",
            code: "en",
          },
          name: messageType,
          components: [
            {
              type: "body",
              parameters,
            },
          ],
        },
      };

      // Send to WhatsApp API
      const api = await axios.post(config.WHATSAPP_API_KEY, body);
      return api.data;
    } catch (error) {
      console.log(error)
      console.error("WhatsApp API error:", error.response?.data || error.message);
    }
  }


  async _sendPushNotification(
    deviceTokens,
    message,
    type,
    sendToAllSubscribed = false,
    title,
    imageUrl
  ) {
    const tokens = Array.isArray(deviceTokens) ? deviceTokens : [deviceTokens];

    const payload = {
      app_id: config?.ONE_SIGNAL_APP_ID,
      include_external_user_ids: tokens,
      channel_for_external_user_ids: "push",
      headings: { en: title || "Notification" },
      contents: { en: message },
    };

    if (imageUrl) {
      payload.big_picture = imageUrl; // Android
      payload.ios_attachments = { id1: imageUrl }; // iOS
    }

    try {
      const response = await axios.post(
        "https://onesignal.com/api/v1/notifications",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${config.ONE_SIGNAL_API_KEY}`,
          },
        }
      );

      const recipientCount = response.data.recipients || 0;

      return {
        http_status: response.status,
        server_response: response.data,
        successCount: recipientCount,
        failureCount: tokens.length - recipientCount,
      };
    } catch (error) {
      return {
        http_status: error.response?.status || 500,
        server_response: error.response?.data || {},
        successCount: 0,
        failureCount: tokens.length,
        error: error.response?.data?.errors?.join(", ") || error.message,
      };
    }
  }

  scheduleNotification({ cronPattern, notificationOptions, callback }) {
    const job = cron.schedule(cronPattern, async () => {
      try {
        const results = await this.sendNotification(notificationOptions);
        if (callback) callback(null, results);
      } catch (error) {
        if (callback) callback(error, null);
      }
    });

    const jobId = `job-${Date.now()}`;
    this.scheduledJobs.set(jobId, job);
    return jobId;
  }

  cancelScheduledNotification(jobId) {
    const job = this.scheduledJobs.get(jobId);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(jobId);
    }
  }

  getScheduledJobs() {
    return this.scheduledJobs;
  }
}

const smsService = new NotificationService();
export default smsService;