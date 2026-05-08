import cron from 'node-cron';
import promotionModel from '../infrastructure/models/chit/notify/promotionModel.js';
import NotifyUsecase from '../usecases/auth/chit/client/notifyUseCase.js';
import isNotificationEnabled from '../utils/notificationEnableChecket.js';

const TIMEZONE = 'Asia/Kolkata';
const POLL_CRON = '* * * * *';

class PromotionScheduler {
  constructor() {
    this.notifyUsecase = new NotifyUsecase();
    this.initialize();
  }

  initialize() {
    cron.schedule(POLL_CRON, this.processDuePromotions.bind(this), {
      scheduled: true,
      timezone: TIMEZONE,
    });
    console.log('✅ PromotionScheduler started (polling every minute)');
  }

  async processDuePromotions() {
    try {
      const now = new Date();

      const duePromotions = await promotionModel.find({
        status: 'scheduled',
        scheduledAt: { $lte: now },
        active: true,
      }).lean();

      if (!duePromotions.length) return;

      console.log(`📢 [PromotionScheduler] Found ${duePromotions.length} due promotion(s)`);

      const notificationEnabled = await isNotificationEnabled('Promotioncreation');

      for (const promotion of duePromotions) {
        await this.runPromotion(promotion, notificationEnabled);
      }
    } catch (err) {
      console.error('❌ [PromotionScheduler] Error in processDuePromotions:', err);
    }
  }

  async runPromotion(promotion, notificationEnabled) {
    try {
      await promotionModel.findByIdAndUpdate(promotion._id, { status: 'pending' });

      if (!notificationEnabled) {
        await promotionModel.findByIdAndUpdate(promotion._id, {
          status: 'sent',
          sentAt: new Date(),
        });
        console.log(`⚠️ [PromotionScheduler] Promotion ${promotion._id} marked sent (notifications disabled)`);
        return;
      }

      const { pushCount, pushFailCount } = await this.notifyUsecase._executePromotion({
        promotion,
        schemeBased: promotion.schemeBased,
        selectAll: promotion.selectAll,
        id_scheme: promotion.schemeId || [],
        customer_id: [],
        title: promotion.title,
        body: promotion.body,
        imageUrlFinal: promotion.noti_image || null,
      });

      await promotionModel.findByIdAndUpdate(promotion._id, {
        status: 'sent',
        sentAt: new Date(),
        pushCount,
        pushFailCount,
      });

      console.log(`✅ [PromotionScheduler] Promotion ${promotion._id} sent — push: ${pushCount}, failed: ${pushFailCount}`);
    } catch (err) {
      await promotionModel.findByIdAndUpdate(promotion._id, { status: 'failed' });
      console.error(`❌ [PromotionScheduler] Promotion ${promotion._id} failed:`, err.message);
    }
  }
}

new PromotionScheduler();
