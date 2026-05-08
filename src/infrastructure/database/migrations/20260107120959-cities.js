/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  try {
    const cityArray = [
      {
        "city_name": "Bapatla",
        "id_city": "29",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Dharmavaram",
        "id_city": "63",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Enikapadu",
        "id_city": "72",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gudur",
        "id_city": "88",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kalyandurg",
        "id_city": "105",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kodar",
        "id_city": "119",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kovur",
        "id_city": "127",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Madaram",
        "id_city": "140",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Palkonda",
        "id_city": "187",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pedagantyada",
        "id_city": "196",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Penugonda",
        "id_city": "200",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ramarajupalli",
        "id_city": "223",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ramavarappadu",
        "id_city": "224",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Shar",
        "id_city": "241",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sompeta",
        "id_city": "245",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sulurpeta",
        "id_city": "253",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Roing",
        "id_city": "311",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Badarpur",
        "id_city": "320",
        "state_name": "Assam"
      },
      {
        "city_name": "Bamun Sualkuchi",
        "id_city": "323",
        "state_name": "Assam"
      },
      {
        "city_name": "Basugaon",
        "id_city": "328",
        "state_name": "Assam"
      },
      {
        "city_name": "Bijni",
        "id_city": "330",
        "state_name": "Assam"
      },
      {
        "city_name": "Dharapur",
        "id_city": "345",
        "state_name": "Assam"
      },
      {
        "city_name": "Hauraghat",
        "id_city": "376",
        "state_name": "Assam"
      },
      {
        "city_name": "Jonai Bazar",
        "id_city": "381",
        "state_name": "Assam"
      },
      {
        "city_name": "Karimganj",
        "id_city": "386",
        "state_name": "Assam"
      },
      {
        "city_name": "Niz-Hajo",
        "id_city": "418",
        "state_name": "Assam"
      },
      {
        "city_name": "Ara",
        "id_city": "449",
        "state_name": "Bihar"
      },
      {
        "city_name": "Asarganj",
        "id_city": "452",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bombuflat",
        "id_city": "1",
        "state_name": "Andaman and Nicobar Islands"
      },
      {
        "city_name": "Ajjaram",
        "id_city": "9",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Challapalle",
        "id_city": "41",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chidiga",
        "id_city": "45",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chunchupalle",
        "id_city": "57",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Fakirtakya",
        "id_city": "73",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gaddiannaram",
        "id_city": "75",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Godavarikhani",
        "id_city": "83",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gudivada",
        "id_city": "87",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kosgi",
        "id_city": "124",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kothavalasa",
        "id_city": "125",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Machavaram",
        "id_city": "136",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mahbubabad",
        "id_city": "145",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Manthani",
        "id_city": "152",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Marturu",
        "id_city": "154",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Peddapuram",
        "id_city": "198",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pendurthi",
        "id_city": "199",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Phirangipuram",
        "id_city": "202",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Salur",
        "id_city": "235",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Yendada",
        "id_city": "297",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chandrapur Bagicha",
        "id_city": "340",
        "state_name": "Assam"
      },
      {
        "city_name": "Dergaon",
        "id_city": "344",
        "state_name": "Assam"
      },
      {
        "city_name": "Gohpur",
        "id_city": "367",
        "state_name": "Assam"
      },
      {
        "city_name": "Golaghat",
        "id_city": "368",
        "state_name": "Assam"
      },
      {
        "city_name": "Mangaldai",
        "id_city": "404",
        "state_name": "Assam"
      },
      {
        "city_name": "Amarpur",
        "id_city": "448",
        "state_name": "Bihar"
      },
      {
        "city_name": "Behea",
        "id_city": "468",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bihariganj",
        "id_city": "477",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chhatapur",
        "id_city": "485",
        "state_name": "Bihar"
      },
      {
        "city_name": "Banganapalle",
        "id_city": "28",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bestavaripeta",
        "id_city": "32",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Cuddapah",
        "id_city": "58",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Dowlaiswaram",
        "id_city": "66",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Farrukhnagar",
        "id_city": "74",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gajapathinagaram",
        "id_city": "76",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kamalapuram",
        "id_city": "106",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Karnul",
        "id_city": "114",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kondapalle",
        "id_city": "122",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kondukur",
        "id_city": "123",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mancheral",
        "id_city": "148",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pothinamallayyapalem",
        "id_city": "206",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sriharikota",
        "id_city": "246",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sriramnagar",
        "id_city": "249",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Yenamalakudru",
        "id_city": "296",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Deomali",
        "id_city": "304",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Barpeta",
        "id_city": "326",
        "state_name": "Assam"
      },
      {
        "city_name": "Borgolai",
        "id_city": "338",
        "state_name": "Assam"
      },
      {
        "city_name": "Dokmoka",
        "id_city": "358",
        "state_name": "Assam"
      },
      {
        "city_name": "Kanakpur",
        "id_city": "385",
        "state_name": "Assam"
      },
      {
        "city_name": "Lala",
        "id_city": "394",
        "state_name": "Assam"
      },
      {
        "city_name": "Moran",
        "id_city": "409",
        "state_name": "Assam"
      },
      {
        "city_name": "Raha",
        "id_city": "424",
        "state_name": "Assam"
      },
      {
        "city_name": "Rangapara",
        "id_city": "425",
        "state_name": "Assam"
      },
      {
        "city_name": "Silchar Part-X",
        "id_city": "436",
        "state_name": "Assam"
      },
      {
        "city_name": "Bhimnagar",
        "id_city": "473",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chhapra",
        "id_city": "484",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dalsingh Sarai",
        "id_city": "487",
        "state_name": "Bihar"
      },
      {
        "city_name": "Daudnagar",
        "id_city": "489",
        "state_name": "Bihar"
      },
      {
        "city_name": "Rangat",
        "id_city": "4",
        "state_name": "Andaman and Nicobar Islands"
      },
      {
        "city_name": "Amudalavalasa",
        "id_city": "16",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Amur",
        "id_city": "17",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chatakonda",
        "id_city": "43",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chimakurthy",
        "id_city": "47",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chipurupalle",
        "id_city": "52",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "East Godavari Dist.",
        "id_city": "67",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gorrekunta",
        "id_city": "86",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Guntakal",
        "id_city": "89",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Krishna",
        "id_city": "130",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Madikonda",
        "id_city": "142",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mirpet",
        "id_city": "157",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Narsapur",
        "id_city": "169",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ponnur",
        "id_city": "204",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Prasantinilayam",
        "id_city": "209",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ramachandrapuram",
        "id_city": "220",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tadpatri",
        "id_city": "258",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tigalapahad",
        "id_city": "263",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vijayawada",
        "id_city": "285",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Basar",
        "id_city": "300",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Daporijo",
        "id_city": "303",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Jairampur",
        "id_city": "306",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Seppa",
        "id_city": "312",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Ziro",
        "id_city": "315",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Barbari",
        "id_city": "324",
        "state_name": "Assam"
      },
      {
        "city_name": "Barpathar",
        "id_city": "325",
        "state_name": "Assam"
      },
      {
        "city_name": "Digboi Oil Town",
        "id_city": "353",
        "state_name": "Assam"
      },
      {
        "city_name": "Durga Nagar",
        "id_city": "364",
        "state_name": "Assam"
      },
      {
        "city_name": "Hauli",
        "id_city": "375",
        "state_name": "Assam"
      },
      {
        "city_name": "Kharupetia",
        "id_city": "388",
        "state_name": "Assam"
      },
      {
        "city_name": "Sapatgram",
        "id_city": "428",
        "state_name": "Assam"
      },
      {
        "city_name": "Tangla",
        "id_city": "440",
        "state_name": "Assam"
      },
      {
        "city_name": "Aurangabad",
        "id_city": "453",
        "state_name": "Bihar"
      },
      {
        "city_name": "Buxar",
        "id_city": "481",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chakia",
        "id_city": "482",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dighwara",
        "id_city": "492",
        "state_name": "Bihar"
      },
      {
        "city_name": "Fatwa",
        "id_city": "497",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chintalavalasa",
        "id_city": "51",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Hukumpeta",
        "id_city": "93",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ichchapuram",
        "id_city": "94",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Isnapur",
        "id_city": "95",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kanuru",
        "id_city": "113",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Machilipatnam",
        "id_city": "138",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Madhuravada",
        "id_city": "141",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nandigama",
        "id_city": "162",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nuzvid",
        "id_city": "178",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Patancheru",
        "id_city": "194",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rajampet",
        "id_city": "217",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rishikonda",
        "id_city": "234",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sirpur",
        "id_city": "243",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tirvuru",
        "id_city": "267",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Upper Sileru",
        "id_city": "274",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vijayapuri South",
        "id_city": "284",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vuyyuru",
        "id_city": "289",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Yarada",
        "id_city": "293",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Khonsa",
        "id_city": "307",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Ambikapur",
        "id_city": "317",
        "state_name": "Assam"
      },
      {
        "city_name": "Anand Nagar",
        "id_city": "319",
        "state_name": "Assam"
      },
      {
        "city_name": "Haflong",
        "id_city": "372",
        "state_name": "Assam"
      },
      {
        "city_name": "Jagiroad Paper Mill",
        "id_city": "379",
        "state_name": "Assam"
      },
      {
        "city_name": "Kumar Kaibarta Gaon",
        "id_city": "391",
        "state_name": "Assam"
      },
      {
        "city_name": "Lakhimpur",
        "id_city": "392",
        "state_name": "Assam"
      },
      {
        "city_name": "Nalbari",
        "id_city": "413",
        "state_name": "Assam"
      },
      {
        "city_name": "New Bongaigaon Railway Colony",
        "id_city": "417",
        "state_name": "Assam"
      },
      {
        "city_name": "Rangia",
        "id_city": "426",
        "state_name": "Assam"
      },
      {
        "city_name": "Titabor",
        "id_city": "444",
        "state_name": "Assam"
      },
      {
        "city_name": "Barauni Oil Township",
        "id_city": "462",
        "state_name": "Bihar"
      },
      {
        "city_name": "Barh",
        "id_city": "463",
        "state_name": "Bihar"
      },
      {
        "city_name": "Begusarai",
        "id_city": "467",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bhabua",
        "id_city": "471",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bikramganj",
        "id_city": "478",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dumraon",
        "id_city": "496",
        "state_name": "Bihar"
      },
      {
        "city_name": "Forbesganj",
        "id_city": "498",
        "state_name": "Bihar"
      },
      {
        "city_name": "Port Blair",
        "id_city": "3",
        "state_name": "Andaman and Nicobar Islands"
      },
      {
        "city_name": "Akividu",
        "id_city": "10",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Balapur",
        "id_city": "26",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bapulapadu",
        "id_city": "30",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chirala",
        "id_city": "53",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Choutuppal",
        "id_city": "56",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Dasnapur",
        "id_city": "61",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Hindupur",
        "id_city": "92",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kottapalli",
        "id_city": "126",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kovurpalle",
        "id_city": "128",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mandasa",
        "id_city": "150",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Metpalli",
        "id_city": "155",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mindi",
        "id_city": "156",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Narsingi",
        "id_city": "170",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pedana",
        "id_city": "197",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Prasadampadu",
        "id_city": "208",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ramanayyapeta",
        "id_city": "221",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ramapuram",
        "id_city": "222",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Serilungampalle",
        "id_city": "239",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Uppal Kalan",
        "id_city": "273",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Venkatapuram",
        "id_city": "280",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Changlang",
        "id_city": "302",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Bongaigaon",
        "id_city": "336",
        "state_name": "Assam"
      },
      {
        "city_name": "Jorhat",
        "id_city": "382",
        "state_name": "Assam"
      },
      {
        "city_name": "Lido Tikok",
        "id_city": "396",
        "state_name": "Assam"
      },
      {
        "city_name": "Moranhat",
        "id_city": "410",
        "state_name": "Assam"
      },
      {
        "city_name": "Senchoagaon",
        "id_city": "432",
        "state_name": "Assam"
      },
      {
        "city_name": "Sorbhog",
        "id_city": "438",
        "state_name": "Assam"
      },
      {
        "city_name": "Colgong",
        "id_city": "486",
        "state_name": "Bihar"
      },
      {
        "city_name": "Darbhanga",
        "id_city": "488",
        "state_name": "Bihar"
      },
      {
        "city_name": "Alampur",
        "id_city": "14",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Attili",
        "id_city": "22",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bandarulanka",
        "id_city": "27",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bhattiprolu",
        "id_city": "34",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bhimunipatnam",
        "id_city": "36",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Darnakal",
        "id_city": "60",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Eddumailaram",
        "id_city": "68",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Jaggayyapeta",
        "id_city": "96",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kallur",
        "id_city": "104",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kanithi",
        "id_city": "110",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kurnool",
        "id_city": "133",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Markapur",
        "id_city": "153",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Palakole",
        "id_city": "183",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Parvatipuram",
        "id_city": "193",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rajahmundry",
        "id_city": "215",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Shankarampet",
        "id_city": "240",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Suriapet",
        "id_city": "254",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tenali",
        "id_city": "262",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Venkatagiri",
        "id_city": "279",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Namsai",
        "id_city": "309",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Bohori",
        "id_city": "333",
        "state_name": "Assam"
      },
      {
        "city_name": "Hojai",
        "id_city": "377",
        "state_name": "Assam"
      },
      {
        "city_name": "Jagiroad",
        "id_city": "378",
        "state_name": "Assam"
      },
      {
        "city_name": "Kochpara",
        "id_city": "389",
        "state_name": "Assam"
      },
      {
        "city_name": "Nagaon",
        "id_city": "411",
        "state_name": "Assam"
      },
      {
        "city_name": "Nazira",
        "id_city": "416",
        "state_name": "Assam"
      },
      {
        "city_name": "Sualkuchi",
        "id_city": "439",
        "state_name": "Assam"
      },
      {
        "city_name": "Barhiya",
        "id_city": "464",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bettiah",
        "id_city": "470",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bhagalpur",
        "id_city": "472",
        "state_name": "Bihar"
      },
      {
        "city_name": "Adoni",
        "id_city": "7",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Akkireddipalem",
        "id_city": "13",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Atmakur",
        "id_city": "21",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Badepalli",
        "id_city": "24",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gannavaram",
        "id_city": "79",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kovvur",
        "id_city": "129",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mothugudam",
        "id_city": "159",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nagari",
        "id_city": "160",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Omerkhan daira",
        "id_city": "179",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Palmaner",
        "id_city": "188",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pamur",
        "id_city": "189",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Panjim",
        "id_city": "190",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Punganuru",
        "id_city": "212",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rampachodavaram",
        "id_city": "226",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sattenapalle",
        "id_city": "237",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Srikakulam",
        "id_city": "247",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sriramsagar",
        "id_city": "250",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Suryaraopet",
        "id_city": "255",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Trimulgherry",
        "id_city": "268",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tuni",
        "id_city": "269",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vadlapudi",
        "id_city": "276",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bokajan",
        "id_city": "334",
        "state_name": "Assam"
      },
      {
        "city_name": "Dhemaji",
        "id_city": "347",
        "state_name": "Assam"
      },
      {
        "city_name": "Lanka",
        "id_city": "395",
        "state_name": "Assam"
      },
      {
        "city_name": "Majgaon",
        "id_city": "402",
        "state_name": "Assam"
      },
      {
        "city_name": "Marigaon",
        "id_city": "408",
        "state_name": "Assam"
      },
      {
        "city_name": "Silchar",
        "id_city": "435",
        "state_name": "Assam"
      },
      {
        "city_name": "Belsand",
        "id_city": "469",
        "state_name": "Bihar"
      },
      {
        "city_name": "Akkarampalle",
        "id_city": "11",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bhimavaram",
        "id_city": "35",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chemmumiahpet",
        "id_city": "44",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chinagantyada",
        "id_city": "49",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Edulapuram",
        "id_city": "69",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ekambara kuppam",
        "id_city": "70",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kadiri",
        "id_city": "101",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kakinada",
        "id_city": "103",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kanapaka",
        "id_city": "108",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kanigiri",
        "id_city": "109",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Macherla",
        "id_city": "137",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Madanapalle",
        "id_city": "139",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nelimaria",
        "id_city": "175",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ravulapalam",
        "id_city": "227",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Uravakonda",
        "id_city": "275",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Wanparti",
        "id_city": "290",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bondila",
        "id_city": "301",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Itanagar",
        "id_city": "305",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Pasighat",
        "id_city": "310",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Bongaigaon Petro-chemical Town",
        "id_city": "337",
        "state_name": "Assam"
      },
      {
        "city_name": "Chabua",
        "id_city": "339",
        "state_name": "Assam"
      },
      {
        "city_name": "Gauripur",
        "id_city": "365",
        "state_name": "Assam"
      },
      {
        "city_name": "Guwahati",
        "id_city": "371",
        "state_name": "Assam"
      },
      {
        "city_name": "Hamren",
        "id_city": "374",
        "state_name": "Assam"
      },
      {
        "city_name": "Mahur",
        "id_city": "400",
        "state_name": "Assam"
      },
      {
        "city_name": "Salakati",
        "id_city": "427",
        "state_name": "Assam"
      },
      {
        "city_name": "Udalguri",
        "id_city": "445",
        "state_name": "Assam"
      },
      {
        "city_name": "Uttar Krishnapur Part-I",
        "id_city": "447",
        "state_name": "Assam"
      },
      {
        "city_name": "Bagaha",
        "id_city": "454",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bakhtiyarpur",
        "id_city": "457",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bar Bigha",
        "id_city": "460",
        "state_name": "Bihar"
      },
      {
        "city_name": "Belampalli",
        "id_city": "31",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chilakaluripet",
        "id_city": "46",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Cumbum",
        "id_city": "59",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Khanapuram Haveli",
        "id_city": "118",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kollapur",
        "id_city": "120",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kondapalem",
        "id_city": "121",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mangalagiri",
        "id_city": "151",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Moragudi",
        "id_city": "158",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Narasannapeta",
        "id_city": "165",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ongole",
        "id_city": "180",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pakala",
        "id_city": "182",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Palakurthi",
        "id_city": "184",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Port Blair",
        "id_city": "205",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Prakasam",
        "id_city": "207",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Puttur",
        "id_city": "213",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rameswaram",
        "id_city": "225",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Renigunta",
        "id_city": "232",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tadepalligudem",
        "id_city": "257",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tirupati",
        "id_city": "266",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ukkayapalli",
        "id_city": "271",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Yemmiganur",
        "id_city": "295",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Along",
        "id_city": "299",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Choto Haibor",
        "id_city": "343",
        "state_name": "Assam"
      },
      {
        "city_name": "Doboka",
        "id_city": "357",
        "state_name": "Assam"
      },
      {
        "city_name": "Duliagaon",
        "id_city": "360",
        "state_name": "Assam"
      },
      {
        "city_name": "Dum Duma",
        "id_city": "363",
        "state_name": "Assam"
      },
      {
        "city_name": "Kokrajhar",
        "id_city": "390",
        "state_name": "Assam"
      },
      {
        "city_name": "Silapathar",
        "id_city": "434",
        "state_name": "Assam"
      },
      {
        "city_name": "Barauli",
        "id_city": "461",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dinapur",
        "id_city": "493",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dinapur Cantonment",
        "id_city": "494",
        "state_name": "Bihar"
      },
      {
        "city_name": "Gaya",
        "id_city": "499",
        "state_name": "Bihar"
      },
      {
        "city_name": "Amalapuram",
        "id_city": "15",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Anakapalle",
        "id_city": "18",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Anantapur",
        "id_city": "19",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Andole",
        "id_city": "20",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Dommara Nandyal",
        "id_city": "65",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gajularega",
        "id_city": "77",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Garacharma",
        "id_city": "80",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Jarjapupeta",
        "id_city": "100",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kantabamsuguda",
        "id_city": "112",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Lalbahadur Nagar",
        "id_city": "135",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nathayyapalem",
        "id_city": "173",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Palasa",
        "id_city": "185",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Payakaraopet",
        "id_city": "195",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Singarayakonda",
        "id_city": "242",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tirumala",
        "id_city": "265",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Badarpur Railway Town",
        "id_city": "321",
        "state_name": "Assam"
      },
      {
        "city_name": "Bihpuria",
        "id_city": "329",
        "state_name": "Assam"
      },
      {
        "city_name": "Bilasipara",
        "id_city": "331",
        "state_name": "Assam"
      },
      {
        "city_name": "Dimaruguri",
        "id_city": "354",
        "state_name": "Assam"
      },
      {
        "city_name": "Donkamokan",
        "id_city": "359",
        "state_name": "Assam"
      },
      {
        "city_name": "Gossaigaon",
        "id_city": "370",
        "state_name": "Assam"
      },
      {
        "city_name": "Lido Town",
        "id_city": "397",
        "state_name": "Assam"
      },
      {
        "city_name": "Lumding Railway Colony",
        "id_city": "399",
        "state_name": "Assam"
      },
      {
        "city_name": "Naubaisa Gaon",
        "id_city": "415",
        "state_name": "Assam"
      },
      {
        "city_name": "North Guwahati",
        "id_city": "419",
        "state_name": "Assam"
      },
      {
        "city_name": "Numaligarh",
        "id_city": "420",
        "state_name": "Assam"
      },
      {
        "city_name": "Panchgram",
        "id_city": "422",
        "state_name": "Assam"
      },
      {
        "city_name": "Umrangso",
        "id_city": "446",
        "state_name": "Assam"
      },
      {
        "city_name": "Dehri",
        "id_city": "490",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dhaka",
        "id_city": "491",
        "state_name": "Bihar"
      },
      {
        "city_name": "Garacharma",
        "id_city": "2",
        "state_name": "Andaman and Nicobar Islands"
      },
      {
        "city_name": "Bommuru",
        "id_city": "39",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bugganipalle",
        "id_city": "40",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Eluru",
        "id_city": "71",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kamareddi",
        "id_city": "107",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kazipet",
        "id_city": "117",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mamilapalle",
        "id_city": "147",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nandikotkur",
        "id_city": "163",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Osmania University",
        "id_city": "181",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Parasamba",
        "id_city": "192",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Proddatur",
        "id_city": "210",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rajamahendri",
        "id_city": "216",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rajoli",
        "id_city": "219",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Visakhapatnam",
        "id_city": "287",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vizianagaram",
        "id_city": "288",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Yadagirigutta",
        "id_city": "292",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bahbari Gaon",
        "id_city": "322",
        "state_name": "Assam"
      },
      {
        "city_name": "Bokokhat",
        "id_city": "335",
        "state_name": "Assam"
      },
      {
        "city_name": "Dhekiajuli",
        "id_city": "346",
        "state_name": "Assam"
      },
      {
        "city_name": "Dibrugarh",
        "id_city": "351",
        "state_name": "Assam"
      },
      {
        "city_name": "Duliajan",
        "id_city": "361",
        "state_name": "Assam"
      },
      {
        "city_name": "Kharijapikon",
        "id_city": "387",
        "state_name": "Assam"
      },
      {
        "city_name": "Lumding",
        "id_city": "398",
        "state_name": "Assam"
      },
      {
        "city_name": "Maibong",
        "id_city": "401",
        "state_name": "Assam"
      },
      {
        "city_name": "Namrup",
        "id_city": "414",
        "state_name": "Assam"
      },
      {
        "city_name": "Pathsala",
        "id_city": "423",
        "state_name": "Assam"
      },
      {
        "city_name": "Sonari",
        "id_city": "437",
        "state_name": "Assam"
      },
      {
        "city_name": "Tihu",
        "id_city": "442",
        "state_name": "Assam"
      },
      {
        "city_name": "Bahadurganj",
        "id_city": "455",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bariapur",
        "id_city": "465",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bihar",
        "id_city": "475",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bihar Sharif",
        "id_city": "476",
        "state_name": "Bihar"
      },
      {
        "city_name": "Badvel",
        "id_city": "25",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Bobbili",
        "id_city": "37",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chandur",
        "id_city": "42",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chittoor",
        "id_city": "54",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chodavaram",
        "id_city": "55",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Dauleshwaram",
        "id_city": "62",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gajuvaka",
        "id_city": "78",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gopalapatnam",
        "id_city": "84",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Guti",
        "id_city": "91",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kankipadu",
        "id_city": "111",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kavali",
        "id_city": "116",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Malkajgiri",
        "id_city": "146",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Narsipatnam",
        "id_city": "171",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Naspur",
        "id_city": "172",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nayudupeta",
        "id_city": "174",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nellore",
        "id_city": "176",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rayachoti",
        "id_city": "228",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Razole",
        "id_city": "231",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Srikalahasti",
        "id_city": "248",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Srisailam",
        "id_city": "251",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tadepalle",
        "id_city": "256",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tanuku",
        "id_city": "260",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Ukkunagaram",
        "id_city": "272",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vaparala",
        "id_city": "277",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "West Godavari Dist.",
        "id_city": "291",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Naharlagun",
        "id_city": "308",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Chapar",
        "id_city": "341",
        "state_name": "Assam"
      },
      {
        "city_name": "Diphu",
        "id_city": "355",
        "state_name": "Assam"
      },
      {
        "city_name": "Duliajan No.1",
        "id_city": "362",
        "state_name": "Assam"
      },
      {
        "city_name": "Jogighopa",
        "id_city": "380",
        "state_name": "Assam"
      },
      {
        "city_name": "Kampur Town",
        "id_city": "383",
        "state_name": "Assam"
      },
      {
        "city_name": "Kamrup",
        "id_city": "384",
        "state_name": "Assam"
      },
      {
        "city_name": "Mariani",
        "id_city": "407",
        "state_name": "Assam"
      },
      {
        "city_name": "Naharkatia",
        "id_city": "412",
        "state_name": "Assam"
      },
      {
        "city_name": "Palasbari",
        "id_city": "421",
        "state_name": "Assam"
      },
      {
        "city_name": "Sarthebari",
        "id_city": "429",
        "state_name": "Assam"
      },
      {
        "city_name": "Bhojpur",
        "id_city": "474",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chanpatia",
        "id_city": "483",
        "state_name": "Bihar"
      },
      {
        "city_name": "Gazipur",
        "id_city": "500",
        "state_name": "Bihar"
      },
      {
        "city_name": "Addanki",
        "id_city": "5",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Avanigadda",
        "id_city": "23",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Lakshettipet",
        "id_city": "134",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nagireddipalle",
        "id_city": "161",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nandyal",
        "id_city": "164",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Narasaraopet",
        "id_city": "167",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Nidadavole",
        "id_city": "177",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Papampeta",
        "id_city": "191",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Penukonda",
        "id_city": "201",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pithapuram",
        "id_city": "203",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Samalkot",
        "id_city": "236",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tallapalle",
        "id_city": "259",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vemalwada",
        "id_city": "278",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vinukonda",
        "id_city": "286",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tawang",
        "id_city": "313",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Biswanath Chariali",
        "id_city": "332",
        "state_name": "Assam"
      },
      {
        "city_name": "Digboi",
        "id_city": "352",
        "state_name": "Assam"
      },
      {
        "city_name": "Sibsagar",
        "id_city": "433",
        "state_name": "Assam"
      },
      {
        "city_name": "Tinsukia",
        "id_city": "443",
        "state_name": "Assam"
      },
      {
        "city_name": "Areraj",
        "id_city": "451",
        "state_name": "Bihar"
      },
      {
        "city_name": "Baruni",
        "id_city": "466",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dumra",
        "id_city": "495",
        "state_name": "Bihar"
      },
      {
        "city_name": "Dhone",
        "id_city": "64",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Garimellapadu",
        "id_city": "81",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Giddalur",
        "id_city": "82",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Gopalur",
        "id_city": "85",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Guntur",
        "id_city": "90",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Jammalamadugu",
        "id_city": "98",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kaikalur",
        "id_city": "102",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Katheru",
        "id_city": "115",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mandapeta",
        "id_city": "149",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Narasapur",
        "id_city": "166",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Palempalle",
        "id_city": "186",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Pulivendla",
        "id_city": "211",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Razam",
        "id_city": "230",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Seetharampuram",
        "id_city": "238",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Sirsilla",
        "id_city": "244",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Srisailamgudem Devasthanam",
        "id_city": "252",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tekkali",
        "id_city": "261",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Turangi",
        "id_city": "270",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vepagunta",
        "id_city": "281",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vetapalem",
        "id_city": "282",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chekonidhara",
        "id_city": "342",
        "state_name": "Assam"
      },
      {
        "city_name": "Dhubri",
        "id_city": "349",
        "state_name": "Assam"
      },
      {
        "city_name": "Dhuburi",
        "id_city": "350",
        "state_name": "Assam"
      },
      {
        "city_name": "Dispur",
        "id_city": "356",
        "state_name": "Assam"
      },
      {
        "city_name": "Goalpara",
        "id_city": "366",
        "state_name": "Assam"
      },
      {
        "city_name": "Golakganj",
        "id_city": "369",
        "state_name": "Assam"
      },
      {
        "city_name": "Hailakandi",
        "id_city": "373",
        "state_name": "Assam"
      },
      {
        "city_name": "Margherita",
        "id_city": "406",
        "state_name": "Assam"
      },
      {
        "city_name": "Sarupathar",
        "id_city": "430",
        "state_name": "Assam"
      },
      {
        "city_name": "Sarupathar Bengali",
        "id_city": "431",
        "state_name": "Assam"
      },
      {
        "city_name": "Araria",
        "id_city": "450",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bairgania",
        "id_city": "456",
        "state_name": "Bihar"
      },
      {
        "city_name": "Banmankhi",
        "id_city": "459",
        "state_name": "Bihar"
      },
      {
        "city_name": "Birpur",
        "id_city": "479",
        "state_name": "Bihar"
      },
      {
        "city_name": "Adivivaram",
        "id_city": "6",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Aganampudi",
        "id_city": "8",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Akkayapalle",
        "id_city": "12",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Betamcherla",
        "id_city": "33",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chinagadila",
        "id_city": "48",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Chinnachawk",
        "id_city": "50",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Jallaram Kamanpur",
        "id_city": "97",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Jangampalli",
        "id_city": "99",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kuppam",
        "id_city": "131",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Kurmannapalem",
        "id_city": "132",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Madugule",
        "id_city": "143",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Mahabubnagar",
        "id_city": "144",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Narayanavanam",
        "id_city": "168",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Qutubullapur",
        "id_city": "214",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rajendranagar",
        "id_city": "218",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Rayadrug",
        "id_city": "229",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Repalle",
        "id_city": "233",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tiruchanur",
        "id_city": "264",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Vijayapuri",
        "id_city": "283",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Yellamanchili",
        "id_city": "294",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Yerraguntla",
        "id_city": "298",
        "state_name": "Andhra Pradesh"
      },
      {
        "city_name": "Tezu",
        "id_city": "314",
        "state_name": "Arunachal Pradesh"
      },
      {
        "city_name": "Abhayapuri",
        "id_city": "316",
        "state_name": "Assam"
      },
      {
        "city_name": "Amguri",
        "id_city": "318",
        "state_name": "Assam"
      },
      {
        "city_name": "Barpeta Road",
        "id_city": "327",
        "state_name": "Assam"
      },
      {
        "city_name": "Dhing",
        "id_city": "348",
        "state_name": "Assam"
      },
      {
        "city_name": "Lakhipur",
        "id_city": "393",
        "state_name": "Assam"
      },
      {
        "city_name": "Makum",
        "id_city": "403",
        "state_name": "Assam"
      },
      {
        "city_name": "Mankachar",
        "id_city": "405",
        "state_name": "Assam"
      },
      {
        "city_name": "Tezpur",
        "id_city": "441",
        "state_name": "Assam"
      },
      {
        "city_name": "Banka",
        "id_city": "458",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bodh Gaya",
        "id_city": "480",
        "state_name": "Bihar"
      },
      {
        "city_name": "Kanti",
        "id_city": "522",
        "state_name": "Bihar"
      },
      {
        "city_name": "Kharagpur",
        "id_city": "528",
        "state_name": "Bihar"
      },
      {
        "city_name": "Maharajganj",
        "id_city": "538",
        "state_name": "Bihar"
      },
      {
        "city_name": "Muzaffarpur",
        "id_city": "553",
        "state_name": "Bihar"
      },
      {
        "city_name": "Sasaram",
        "id_city": "578",
        "state_name": "Bihar"
      },
      {
        "city_name": "Shahpur",
        "id_city": "579",
        "state_name": "Bihar"
      },
      {
        "city_name": "Sherghati",
        "id_city": "581",
        "state_name": "Bihar"
      },
      {
        "city_name": "Ahiwara",
        "id_city": "595",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Basna",
        "id_city": "607",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kawardha",
        "id_city": "648",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Korba",
        "id_city": "658",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kurasia",
        "id_city": "664",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Lormi",
        "id_city": "667",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Rajgamar",
        "id_city": "685",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Aquem",
        "id_city": "710",
        "state_name": "Goa"
      },
      {
        "city_name": "Dona Paula",
        "id_city": "732",
        "state_name": "Goa"
      },
      {
        "city_name": "Morjim",
        "id_city": "745",
        "state_name": "Goa"
      },
      {
        "city_name": "Pale",
        "id_city": "748",
        "state_name": "Goa"
      },
      {
        "city_name": "Penha de Franca",
        "id_city": "752",
        "state_name": "Goa"
      },
      {
        "city_name": "Adityana",
        "id_city": "781",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ambaliyasan",
        "id_city": "787",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bajva",
        "id_city": "806",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bhavnagar",
        "id_city": "821",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bodakdev",
        "id_city": "828",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Botad",
        "id_city": "834",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chanasma",
        "id_city": "840",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chandkheda",
        "id_city": "842",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chenpur",
        "id_city": "845",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gariadhar",
        "id_city": "889",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Halol",
        "id_city": "894",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Himatnagar",
        "id_city": "898",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jetpur",
        "id_city": "909",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kevadiya",
        "id_city": "932",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kutch",
        "id_city": "942",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Okaf",
        "id_city": "988",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Natwar",
        "id_city": "557",
        "state_name": "Bihar"
      },
      {
        "city_name": "Nawada",
        "id_city": "559",
        "state_name": "Bihar"
      },
      {
        "city_name": "Siwan",
        "id_city": "585",
        "state_name": "Bihar"
      },
      {
        "city_name": "Teghra",
        "id_city": "589",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chandigarh",
        "id_city": "594",
        "state_name": "Chandigarh"
      },
      {
        "city_name": "Birgaon",
        "id_city": "615",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Dipka",
        "id_city": "627",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Katghora",
        "id_city": "647",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kharod",
        "id_city": "651",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Mungeli",
        "id_city": "673",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Saraipali",
        "id_city": "691",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Sarangarh",
        "id_city": "693",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Daman",
        "id_city": "704",
        "state_name": "Daman and Diu"
      },
      {
        "city_name": "Arpora",
        "id_city": "711",
        "state_name": "Goa"
      },
      {
        "city_name": "Carapur",
        "id_city": "721",
        "state_name": "Goa"
      },
      {
        "city_name": "Chicalim",
        "id_city": "722",
        "state_name": "Goa"
      },
      {
        "city_name": "Chimbel",
        "id_city": "723",
        "state_name": "Goa"
      },
      {
        "city_name": "Kankon",
        "id_city": "737",
        "state_name": "Goa"
      },
      {
        "city_name": "Mapusa",
        "id_city": "741",
        "state_name": "Goa"
      },
      {
        "city_name": "Salcette",
        "id_city": "762",
        "state_name": "Goa"
      },
      {
        "city_name": "Serula",
        "id_city": "770",
        "state_name": "Goa"
      },
      {
        "city_name": "Sinquerim",
        "id_city": "771",
        "state_name": "Goa"
      },
      {
        "city_name": "Valpoi",
        "id_city": "775",
        "state_name": "Goa"
      },
      {
        "city_name": "Ambaji",
        "id_city": "786",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ankleshwar",
        "id_city": "795",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bhayavadar",
        "id_city": "822",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chikhli",
        "id_city": "850",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Devgadh Baria",
        "id_city": "861",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhoraji",
        "id_city": "872",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Disa",
        "id_city": "878",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dungarpur",
        "id_city": "880",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gandevi",
        "id_city": "886",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jamjodhpur",
        "id_city": "904",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kapadwanj",
        "id_city": "923",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kheralu",
        "id_city": "938",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mahemdavad",
        "id_city": "953",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mithapur",
        "id_city": "971",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Olpad",
        "id_city": "990",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hazaribagh",
        "id_city": "507",
        "state_name": "Bihar"
      },
      {
        "city_name": "Islampur",
        "id_city": "510",
        "state_name": "Bihar"
      },
      {
        "city_name": "Narkatiaganj",
        "id_city": "555",
        "state_name": "Bihar"
      },
      {
        "city_name": "Shivhar",
        "id_city": "582",
        "state_name": "Bihar"
      },
      {
        "city_name": "Balod",
        "id_city": "603",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Champa",
        "id_city": "617",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kota",
        "id_city": "661",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Raipur",
        "id_city": "684",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Ratanpur",
        "id_city": "689",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Sirgiti",
        "id_city": "696",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bambolim",
        "id_city": "712",
        "state_name": "Goa"
      },
      {
        "city_name": "Davorlim",
        "id_city": "731",
        "state_name": "Goa"
      },
      {
        "city_name": "Parcem",
        "id_city": "750",
        "state_name": "Goa"
      },
      {
        "city_name": "Queula",
        "id_city": "759",
        "state_name": "Goa"
      },
      {
        "city_name": "Reis Magos",
        "id_city": "761",
        "state_name": "Goa"
      },
      {
        "city_name": "Sancoale",
        "id_city": "764",
        "state_name": "Goa"
      },
      {
        "city_name": "Anand",
        "id_city": "791",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Arambhada",
        "id_city": "798",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bhanvad",
        "id_city": "818",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bhestan",
        "id_city": "823",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chaklasi",
        "id_city": "836",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chorvad",
        "id_city": "852",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dahod",
        "id_city": "856",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dakor",
        "id_city": "857",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gondal",
        "id_city": "892",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jawaharnagar",
        "id_city": "907",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kali",
        "id_city": "916",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kheda",
        "id_city": "937",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kundla",
        "id_city": "941",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Meghraj",
        "id_city": "968",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Pali",
        "id_city": "995",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Pandesara",
        "id_city": "998",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hisua",
        "id_city": "509",
        "state_name": "Bihar"
      },
      {
        "city_name": "Jahanabad",
        "id_city": "512",
        "state_name": "Bihar"
      },
      {
        "city_name": "Lakhisarai",
        "id_city": "533",
        "state_name": "Bihar"
      },
      {
        "city_name": "Nokha",
        "id_city": "561",
        "state_name": "Bihar"
      },
      {
        "city_name": "Revelganj",
        "id_city": "573",
        "state_name": "Bihar"
      },
      {
        "city_name": "Silao",
        "id_city": "583",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bhanpuri",
        "id_city": "609",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Dhamdha",
        "id_city": "624",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Dharamjaigarh",
        "id_city": "626",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kurud",
        "id_city": "665",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Pandariya",
        "id_city": "677",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "New Delhi",
        "id_city": "707",
        "state_name": "Delhi"
      },
      {
        "city_name": "Candolim",
        "id_city": "719",
        "state_name": "Goa"
      },
      {
        "city_name": "Caranzalem",
        "id_city": "720",
        "state_name": "Goa"
      },
      {
        "city_name": "Corlim",
        "id_city": "726",
        "state_name": "Goa"
      },
      {
        "city_name": "Loutulim",
        "id_city": "739",
        "state_name": "Goa"
      },
      {
        "city_name": "Margaon",
        "id_city": "743",
        "state_name": "Goa"
      },
      {
        "city_name": "Sanquelim",
        "id_city": "766",
        "state_name": "Goa"
      },
      {
        "city_name": "Tivim",
        "id_city": "774",
        "state_name": "Goa"
      },
      {
        "city_name": "Varca",
        "id_city": "776",
        "state_name": "Goa"
      },
      {
        "city_name": "Boriavi",
        "id_city": "832",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kharaghoda",
        "id_city": "935",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kosamba",
        "id_city": "940",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Morbi",
        "id_city": "974",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Palanpur",
        "id_city": "993",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hasanpur",
        "id_city": "506",
        "state_name": "Bihar"
      },
      {
        "city_name": "Jha Jha",
        "id_city": "519",
        "state_name": "Bihar"
      },
      {
        "city_name": "Koilwar",
        "id_city": "532",
        "state_name": "Bihar"
      },
      {
        "city_name": "Paharpur",
        "id_city": "562",
        "state_name": "Bihar"
      },
      {
        "city_name": "Piro",
        "id_city": "565",
        "state_name": "Bihar"
      },
      {
        "city_name": "Rajgir",
        "id_city": "570",
        "state_name": "Bihar"
      },
      {
        "city_name": "Arang",
        "id_city": "599",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bagbahara",
        "id_city": "601",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gaurela",
        "id_city": "635",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kirandul",
        "id_city": "655",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Sao Jose-de-Areal",
        "id_city": "768",
        "state_name": "Goa"
      },
      {
        "city_name": "Babra",
        "id_city": "801",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Billimora",
        "id_city": "827",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chhapi",
        "id_city": "846",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chhatral",
        "id_city": "848",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhrol",
        "id_city": "874",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hajira INA",
        "id_city": "893",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jasdan",
        "id_city": "906",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jetalsar",
        "id_city": "908",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kandla",
        "id_city": "920",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Lakhtar",
        "id_city": "944",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mahuva",
        "id_city": "955",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mogravadi",
        "id_city": "973",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jhanjharpur",
        "id_city": "520",
        "state_name": "Bihar"
      },
      {
        "city_name": "Jogbani",
        "id_city": "521",
        "state_name": "Bihar"
      },
      {
        "city_name": "Koath",
        "id_city": "531",
        "state_name": "Bihar"
      },
      {
        "city_name": "Lauthaha",
        "id_city": "535",
        "state_name": "Bihar"
      },
      {
        "city_name": "Madhepura",
        "id_city": "536",
        "state_name": "Bihar"
      },
      {
        "city_name": "Mohiuddinagar",
        "id_city": "547",
        "state_name": "Bihar"
      },
      {
        "city_name": "Munger",
        "id_city": "551",
        "state_name": "Bihar"
      },
      {
        "city_name": "Raghunathpur",
        "id_city": "569",
        "state_name": "Bihar"
      },
      {
        "city_name": "Raxaul",
        "id_city": "572",
        "state_name": "Bihar"
      },
      {
        "city_name": "Tekari",
        "id_city": "590",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chirmiri",
        "id_city": "621",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Dhamtari",
        "id_city": "625",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Mahendragarh",
        "id_city": "669",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Naya Baradwar",
        "id_city": "676",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Raigarh",
        "id_city": "683",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Sakti",
        "id_city": "690",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Simga",
        "id_city": "695",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Aldona",
        "id_city": "708",
        "state_name": "Goa"
      },
      {
        "city_name": "Betora",
        "id_city": "716",
        "state_name": "Goa"
      },
      {
        "city_name": "Miramar",
        "id_city": "744",
        "state_name": "Goa"
      },
      {
        "city_name": "Parra",
        "id_city": "751",
        "state_name": "Goa"
      },
      {
        "city_name": "Pilerne",
        "id_city": "754",
        "state_name": "Goa"
      },
      {
        "city_name": "Raia",
        "id_city": "760",
        "state_name": "Goa"
      },
      {
        "city_name": "Ahwa",
        "id_city": "784",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Amod",
        "id_city": "788",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Anklesvar INA",
        "id_city": "796",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bahadarpar",
        "id_city": "804",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bodeli",
        "id_city": "829",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bopal",
        "id_city": "830",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Damnagar",
        "id_city": "858",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhari",
        "id_city": "868",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gadhda",
        "id_city": "885",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Joshipura",
        "id_city": "911",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Khambhat",
        "id_city": "934",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Makarba",
        "id_city": "957",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mendarla",
        "id_city": "970",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Nandesari",
        "id_city": "981",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jamalpur",
        "id_city": "513",
        "state_name": "Bihar"
      },
      {
        "city_name": "Katihar",
        "id_city": "525",
        "state_name": "Bihar"
      },
      {
        "city_name": "Mahnar Bazar",
        "id_city": "539",
        "state_name": "Bihar"
      },
      {
        "city_name": "Mirganj",
        "id_city": "546",
        "state_name": "Bihar"
      },
      {
        "city_name": "Nabinagar",
        "id_city": "554",
        "state_name": "Bihar"
      },
      {
        "city_name": "Nirmali",
        "id_city": "560",
        "state_name": "Bihar"
      },
      {
        "city_name": "Patna",
        "id_city": "563",
        "state_name": "Bihar"
      },
      {
        "city_name": "Saharsa",
        "id_city": "576",
        "state_name": "Bihar"
      },
      {
        "city_name": "Shaikhpura",
        "id_city": "580",
        "state_name": "Bihar"
      },
      {
        "city_name": "Sultanganj",
        "id_city": "587",
        "state_name": "Bihar"
      },
      {
        "city_name": "Vaishali",
        "id_city": "592",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bade Bacheli",
        "id_city": "600",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bemetra",
        "id_city": "608",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bodri",
        "id_city": "616",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Jagdalpur",
        "id_city": "642",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Jamui",
        "id_city": "643",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kohka",
        "id_city": "656",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Lingiyadih",
        "id_city": "666",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Silvassa",
        "id_city": "703",
        "state_name": "Dadra and Nagar Haveli"
      },
      {
        "city_name": "Delhi",
        "id_city": "706",
        "state_name": "Delhi"
      },
      {
        "city_name": "Madgaon",
        "id_city": "740",
        "state_name": "Goa"
      },
      {
        "city_name": "Margao",
        "id_city": "742",
        "state_name": "Goa"
      },
      {
        "city_name": "Porvorim",
        "id_city": "757",
        "state_name": "Goa"
      },
      {
        "city_name": "Amreli",
        "id_city": "789",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Atul",
        "id_city": "800",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bantva",
        "id_city": "810",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bardoli",
        "id_city": "811",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bharuch",
        "id_city": "819",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bilkha",
        "id_city": "826",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chhaprabhatha",
        "id_city": "847",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dabhoi",
        "id_city": "854",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Khed Brahma",
        "id_city": "936",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mangrol",
        "id_city": "966",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mansa",
        "id_city": "967",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Paddhari",
        "id_city": "991",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Palej",
        "id_city": "994",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gopalganj",
        "id_city": "503",
        "state_name": "Bihar"
      },
      {
        "city_name": "Manihari",
        "id_city": "543",
        "state_name": "Bihar"
      },
      {
        "city_name": "Phulwari",
        "id_city": "564",
        "state_name": "Bihar"
      },
      {
        "city_name": "Ambagarh Chauki",
        "id_city": "597",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bhatgaon",
        "id_city": "611",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kanker",
        "id_city": "646",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kharsia",
        "id_city": "652",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Korea",
        "id_city": "659",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kumud Katta",
        "id_city": "663",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Mehmand",
        "id_city": "670",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Namna Kalan",
        "id_city": "675",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Tildanewra",
        "id_city": "699",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Calapor",
        "id_city": "718",
        "state_name": "Goa"
      },
      {
        "city_name": "Chinchinim",
        "id_city": "724",
        "state_name": "Goa"
      },
      {
        "city_name": "Colvale",
        "id_city": "725",
        "state_name": "Goa"
      },
      {
        "city_name": "Navelim",
        "id_city": "747",
        "state_name": "Goa"
      },
      {
        "city_name": "Vasco",
        "id_city": "777",
        "state_name": "Goa"
      },
      {
        "city_name": "Bag-e-Firdosh",
        "id_city": "802",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bedi",
        "id_city": "815",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Cambay",
        "id_city": "835",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Delvada",
        "id_city": "860",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhuwaran",
        "id_city": "876",
        "state_name": "Gujarat"
      },
      {
        "city_name": "GSFC Complex",
        "id_city": "884",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Halvad",
        "id_city": "895",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hansot",
        "id_city": "896",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jafrabad",
        "id_city": "901",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kanjari",
        "id_city": "921",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Limla",
        "id_city": "949",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Nandej",
        "id_city": "980",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Naroda",
        "id_city": "983",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Motihari",
        "id_city": "549",
        "state_name": "Bihar"
      },
      {
        "city_name": "Murliganj",
        "id_city": "552",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bhatapara",
        "id_city": "610",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bhilai",
        "id_city": "612",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Charoda",
        "id_city": "619",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Khonga Pani",
        "id_city": "653",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Koria Block",
        "id_city": "660",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Mowa",
        "id_city": "672",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Pathalgaon",
        "id_city": "679",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Pithora",
        "id_city": "682",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Rajhara",
        "id_city": "686",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Taleigao",
        "id_city": "773",
        "state_name": "Goa"
      },
      {
        "city_name": "Verna",
        "id_city": "778",
        "state_name": "Goa"
      },
      {
        "city_name": "Adalaj",
        "id_city": "780",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ahmedabad",
        "id_city": "783",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bajipura",
        "id_city": "805",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Beyt",
        "id_city": "816",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chala",
        "id_city": "837",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chanod",
        "id_city": "843",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dadara",
        "id_city": "855",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Harij",
        "id_city": "897",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ichchhapor",
        "id_city": "899",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jamnagar",
        "id_city": "905",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jodiya",
        "id_city": "910",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kodinar",
        "id_city": "939",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Lalpur",
        "id_city": "945",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Malpur",
        "id_city": "962",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Nandesari INA",
        "id_city": "982",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Navagam Ghed",
        "id_city": "985",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Habibpur",
        "id_city": "504",
        "state_name": "Bihar"
      },
      {
        "city_name": "Janakpur Road",
        "id_city": "516",
        "state_name": "Bihar"
      },
      {
        "city_name": "Kataiya",
        "id_city": "524",
        "state_name": "Bihar"
      },
      {
        "city_name": "Khusrupur",
        "id_city": "529",
        "state_name": "Bihar"
      },
      {
        "city_name": "Lalganj",
        "id_city": "534",
        "state_name": "Bihar"
      },
      {
        "city_name": "Purnia",
        "id_city": "566",
        "state_name": "Bihar"
      },
      {
        "city_name": "Rusera",
        "id_city": "574",
        "state_name": "Bihar"
      },
      {
        "city_name": "Sagauli",
        "id_city": "575",
        "state_name": "Bihar"
      },
      {
        "city_name": "Charcha",
        "id_city": "618",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Dongragarh",
        "id_city": "630",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Diu",
        "id_city": "705",
        "state_name": "Daman and Diu"
      },
      {
        "city_name": "Altinho",
        "id_city": "709",
        "state_name": "Goa"
      },
      {
        "city_name": "Bandora",
        "id_city": "713",
        "state_name": "Goa"
      },
      {
        "city_name": "Cortalim",
        "id_city": "727",
        "state_name": "Goa"
      },
      {
        "city_name": "Curchorem",
        "id_city": "729",
        "state_name": "Goa"
      },
      {
        "city_name": "Kalangat",
        "id_city": "736",
        "state_name": "Goa"
      },
      {
        "city_name": "Panaji",
        "id_city": "749",
        "state_name": "Goa"
      },
      {
        "city_name": "Abrama",
        "id_city": "779",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bansda",
        "id_city": "809",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bharuch INA",
        "id_city": "820",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chalala",
        "id_city": "838",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chiloda",
        "id_city": "851",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chotila",
        "id_city": "853",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhuva",
        "id_city": "875",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Digvijaygram",
        "id_city": "877",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dungar",
        "id_city": "879",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gandhidham",
        "id_city": "887",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Katpar",
        "id_city": "929",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Modasa",
        "id_city": "972",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Nanakvada",
        "id_city": "979",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jamhaur",
        "id_city": "514",
        "state_name": "Bihar"
      },
      {
        "city_name": "Maner",
        "id_city": "542",
        "state_name": "Bihar"
      },
      {
        "city_name": "Nasriganj",
        "id_city": "556",
        "state_name": "Bihar"
      },
      {
        "city_name": "Pusa",
        "id_city": "567",
        "state_name": "Bihar"
      },
      {
        "city_name": "Rafiganj",
        "id_city": "568",
        "state_name": "Bihar"
      },
      {
        "city_name": "Jhagrakhand",
        "id_city": "645",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kumhari",
        "id_city": "662",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Nailajanjgir",
        "id_city": "674",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Rajnandgaon",
        "id_city": "687",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Jua",
        "id_city": "735",
        "state_name": "Goa"
      },
      {
        "city_name": "Pernem",
        "id_city": "753",
        "state_name": "Goa"
      },
      {
        "city_name": "Banaskantha",
        "id_city": "808",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kalol",
        "id_city": "918",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Maktampur",
        "id_city": "960",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Morvi",
        "id_city": "975",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hilsa",
        "id_city": "508",
        "state_name": "Bihar"
      },
      {
        "city_name": "Khagaul",
        "id_city": "527",
        "state_name": "Bihar"
      },
      {
        "city_name": "Madhubani",
        "id_city": "537",
        "state_name": "Bihar"
      },
      {
        "city_name": "Mairwa",
        "id_city": "540",
        "state_name": "Bihar"
      },
      {
        "city_name": "Makhdumpur",
        "id_city": "541",
        "state_name": "Bihar"
      },
      {
        "city_name": "Motipur",
        "id_city": "550",
        "state_name": "Bihar"
      },
      {
        "city_name": "Naugachhia",
        "id_city": "558",
        "state_name": "Bihar"
      },
      {
        "city_name": "Supaul",
        "id_city": "588",
        "state_name": "Bihar"
      },
      {
        "city_name": "Bilha",
        "id_city": "614",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Dongargaon",
        "id_city": "629",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gariaband",
        "id_city": "634",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Hatkachora",
        "id_city": "641",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Khamhria",
        "id_city": "650",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Sarajpur",
        "id_city": "692",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Amli",
        "id_city": "702",
        "state_name": "Dadra and Nagar Haveli"
      },
      {
        "city_name": "Curti",
        "id_city": "730",
        "state_name": "Goa"
      },
      {
        "city_name": "Goa",
        "id_city": "733",
        "state_name": "Goa"
      },
      {
        "city_name": "Saligao",
        "id_city": "763",
        "state_name": "Goa"
      },
      {
        "city_name": "Bilimora",
        "id_city": "825",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chhota Udepur",
        "id_city": "849",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhandhuka",
        "id_city": "863",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhangdhra",
        "id_city": "865",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhansura",
        "id_city": "866",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dholka",
        "id_city": "870",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhrangadhra",
        "id_city": "873",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dwarka",
        "id_city": "882",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Idar",
        "id_city": "900",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Junagadh",
        "id_city": "912",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kadi",
        "id_city": "913",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kalavad",
        "id_city": "915",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kavant",
        "id_city": "930",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Lathi",
        "id_city": "947",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Lunavada",
        "id_city": "950",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mehsana",
        "id_city": "969",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Navsari",
        "id_city": "986",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ode",
        "id_city": "987",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Padra",
        "id_city": "992",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Paliyad",
        "id_city": "997",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Pardi",
        "id_city": "1000",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gogri Jamalpur",
        "id_city": "502",
        "state_name": "Bihar"
      },
      {
        "city_name": "Kishanganj",
        "id_city": "530",
        "state_name": "Bihar"
      },
      {
        "city_name": "Ramnagar",
        "id_city": "571",
        "state_name": "Bihar"
      },
      {
        "city_name": "Sitamarhi",
        "id_city": "584",
        "state_name": "Bihar"
      },
      {
        "city_name": "Ambikapur",
        "id_city": "598",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Baloda",
        "id_city": "604",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Banarsi",
        "id_city": "606",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gidam",
        "id_city": "638",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Khairagarh",
        "id_city": "649",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kirandu",
        "id_city": "654",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Kondagaon",
        "id_city": "657",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Phunderdihari",
        "id_city": "681",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Ramanuj Ganj",
        "id_city": "688",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Telgaon",
        "id_city": "698",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Benaulim",
        "id_city": "715",
        "state_name": "Goa"
      },
      {
        "city_name": "Bicholim",
        "id_city": "717",
        "state_name": "Goa"
      },
      {
        "city_name": "Ponda",
        "id_city": "756",
        "state_name": "Goa"
      },
      {
        "city_name": "Sattari",
        "id_city": "769",
        "state_name": "Goa"
      },
      {
        "city_name": "Advana",
        "id_city": "782",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Balasinor",
        "id_city": "807",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Barwala",
        "id_city": "812",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bhachau",
        "id_city": "817",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Boria",
        "id_city": "831",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chandisar",
        "id_city": "841",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chaya",
        "id_city": "844",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhanera",
        "id_city": "864",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dhola",
        "id_city": "869",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ghogha",
        "id_city": "890",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jambusar",
        "id_city": "903",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Karachiya",
        "id_city": "924",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Karamsad",
        "id_city": "925",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kutiyana",
        "id_city": "943",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Limbdi",
        "id_city": "948",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mahudha",
        "id_city": "954",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Okha",
        "id_city": "989",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jaynagar",
        "id_city": "518",
        "state_name": "Bihar"
      },
      {
        "city_name": "Kasba",
        "id_city": "523",
        "state_name": "Bihar"
      },
      {
        "city_name": "Mokama",
        "id_city": "548",
        "state_name": "Bihar"
      },
      {
        "city_name": "Waris Aliganj",
        "id_city": "593",
        "state_name": "Bihar"
      },
      {
        "city_name": "Chhuikhadan",
        "id_city": "620",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Doman Hill Colliery",
        "id_city": "628",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Durg",
        "id_city": "631",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gogaon",
        "id_city": "640",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Patan",
        "id_city": "678",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Cuncolim",
        "id_city": "728",
        "state_name": "Goa"
      },
      {
        "city_name": "Guirim",
        "id_city": "734",
        "state_name": "Goa"
      },
      {
        "city_name": "Kundaim",
        "id_city": "738",
        "state_name": "Goa"
      },
      {
        "city_name": "Pissurlem",
        "id_city": "755",
        "state_name": "Goa"
      },
      {
        "city_name": "Sanguem",
        "id_city": "765",
        "state_name": "Goa"
      },
      {
        "city_name": "Sanvordem",
        "id_city": "767",
        "state_name": "Goa"
      },
      {
        "city_name": "Alang",
        "id_city": "785",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Amroli",
        "id_city": "790",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Borsad",
        "id_city": "833",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Deesa",
        "id_city": "859",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Devsar",
        "id_city": "862",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Jalalpore",
        "id_city": "902",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kadodara",
        "id_city": "914",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Karjan",
        "id_city": "926",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Keshod",
        "id_city": "931",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Makarpura",
        "id_city": "958",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Makassar",
        "id_city": "959",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Nadiad",
        "id_city": "977",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Navagadh",
        "id_city": "984",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Palitana",
        "id_city": "996",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ghoghardiha",
        "id_city": "501",
        "state_name": "Bihar"
      },
      {
        "city_name": "Jagdispur",
        "id_city": "511",
        "state_name": "Bihar"
      },
      {
        "city_name": "Jamui",
        "id_city": "515",
        "state_name": "Bihar"
      },
      {
        "city_name": "Khagaria",
        "id_city": "526",
        "state_name": "Bihar"
      },
      {
        "city_name": "Sonepur",
        "id_city": "586",
        "state_name": "Bihar"
      },
      {
        "city_name": "Thakurganj",
        "id_city": "591",
        "state_name": "Bihar"
      },
      {
        "city_name": "Baikunthpur",
        "id_city": "602",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Deori",
        "id_city": "623",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gelhapani",
        "id_city": "636",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Jashpurnagar",
        "id_city": "644",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Pendra",
        "id_city": "680",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Vishrampur",
        "id_city": "701",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bardez",
        "id_city": "714",
        "state_name": "Goa"
      },
      {
        "city_name": "Quepem",
        "id_city": "758",
        "state_name": "Goa"
      },
      {
        "city_name": "Andada",
        "id_city": "792",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Antaliya",
        "id_city": "797",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Asarma",
        "id_city": "799",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bagasara",
        "id_city": "803",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bayad",
        "id_city": "813",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bechar",
        "id_city": "814",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bhuj",
        "id_city": "824",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Chalthan",
        "id_city": "839",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Godhra",
        "id_city": "891",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kalol INA",
        "id_city": "919",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kanodar",
        "id_city": "922",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Khambhaliya",
        "id_city": "933",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mahuvar",
        "id_city": "956",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mandvi",
        "id_city": "965",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hajipur",
        "id_city": "505",
        "state_name": "Bihar"
      },
      {
        "city_name": "Janpur",
        "id_city": "517",
        "state_name": "Bihar"
      },
      {
        "city_name": "Marhaura",
        "id_city": "544",
        "state_name": "Bihar"
      },
      {
        "city_name": "Masaurhi",
        "id_city": "545",
        "state_name": "Bihar"
      },
      {
        "city_name": "Samastipur",
        "id_city": "577",
        "state_name": "Bihar"
      },
      {
        "city_name": "Akaltara",
        "id_city": "596",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Baloda Bazar",
        "id_city": "605",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Bilaspur",
        "id_city": "613",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Dantewada",
        "id_city": "622",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Frezarpur",
        "id_city": "632",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gandai",
        "id_city": "633",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gharghoda",
        "id_city": "637",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Gobra Nawapara",
        "id_city": "639",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Mahasamund",
        "id_city": "668",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Mongra",
        "id_city": "671",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Shivrinarayan",
        "id_city": "694",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Takhatpur",
        "id_city": "697",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Urla",
        "id_city": "700",
        "state_name": "Chhattisgarh"
      },
      {
        "city_name": "Mormugao",
        "id_city": "746",
        "state_name": "Goa"
      },
      {
        "city_name": "Siolim",
        "id_city": "772",
        "state_name": "Goa"
      },
      {
        "city_name": "Anjar",
        "id_city": "793",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Anklav",
        "id_city": "794",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dharampur",
        "id_city": "867",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dholka Rural",
        "id_city": "871",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dungra",
        "id_city": "881",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Flelanganj",
        "id_city": "883",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Gandhinagar",
        "id_city": "888",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kaliawadi",
        "id_city": "917",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kathial",
        "id_city": "927",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Kathor",
        "id_city": "928",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Lambha",
        "id_city": "946",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Madhapar",
        "id_city": "951",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Maflipur",
        "id_city": "952",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Malia",
        "id_city": "961",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Manavadar",
        "id_city": "963",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mandal",
        "id_city": "964",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Mundra",
        "id_city": "976",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Naliya",
        "id_city": "978",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Panoli",
        "id_city": "999",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ranavav",
        "id_city": "1015",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sayan",
        "id_city": "1025",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Siddhapur",
        "id_city": "1031",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Upleta",
        "id_city": "1060",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vartej",
        "id_city": "1077",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Waghai",
        "id_city": "1092",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Karnal",
        "id_city": "1148",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kheri Sampla",
        "id_city": "1150",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kundli",
        "id_city": "1151",
        "state_name": "Haryana"
      },
      {
        "city_name": "Loharu",
        "id_city": "1155",
        "state_name": "Haryana"
      },
      {
        "city_name": "Raipur Rani",
        "id_city": "1177",
        "state_name": "Haryana"
      },
      {
        "city_name": "Sasauli",
        "id_city": "1187",
        "state_name": "Haryana"
      },
      {
        "city_name": "Uchana",
        "id_city": "1201",
        "state_name": "Haryana"
      },
      {
        "city_name": "Bilaspur",
        "id_city": "1211",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Chamba",
        "id_city": "1212",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Kalpa",
        "id_city": "1231",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Nahan",
        "id_city": "1243",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Rajgarh",
        "id_city": "1253",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Rampur",
        "id_city": "1254",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Baramulla",
        "id_city": "1282",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Khour",
        "id_city": "1311",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Reasi",
        "id_city": "1336",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Udhampur",
        "id_city": "1347",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Chatra",
        "id_city": "1384",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ghorabandha",
        "id_city": "1406",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Godda",
        "id_city": "1410",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Gumia",
        "id_city": "1415",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jamadoba",
        "id_city": "1424",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jamtara",
        "id_city": "1426",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Lapanga",
        "id_city": "1455",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ranchi",
        "id_city": "1492",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ray",
        "id_city": "1493",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Sahnidih",
        "id_city": "1498",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Sojitra",
        "id_city": "1037",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Surendranagar",
        "id_city": "1042",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Umbergaon INA",
        "id_city": "1054",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vadia",
        "id_city": "1065",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vaso",
        "id_city": "1080",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Buria",
        "id_city": "1110",
        "state_name": "Haryana"
      },
      {
        "city_name": "Hansi",
        "id_city": "1128",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kanina",
        "id_city": "1145",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kansepur",
        "id_city": "1146",
        "state_name": "Haryana"
      },
      {
        "city_name": "Siwani",
        "id_city": "1190",
        "state_name": "Haryana"
      },
      {
        "city_name": "Sonipat",
        "id_city": "1192",
        "state_name": "Haryana"
      },
      {
        "city_name": "Dalhousie Cantonment",
        "id_city": "1217",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Jutogh",
        "id_city": "1229",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Paonta Sahib",
        "id_city": "1250",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Solon",
        "id_city": "1265",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Awantipora",
        "id_city": "1277",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Bishna",
        "id_city": "1290",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Charari Sharief",
        "id_city": "1292",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Pulwama",
        "id_city": "1328",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Bandhgora",
        "id_city": "1359",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Barki Saraiya",
        "id_city": "1363",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Basukinath",
        "id_city": "1367",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Dhaunsar",
        "id_city": "1398",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Egarkunr",
        "id_city": "1402",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Gomoh",
        "id_city": "1413",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Hazaribag",
        "id_city": "1418",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jadugora",
        "id_city": "1422",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Maithon",
        "id_city": "1462",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Noamundi",
        "id_city": "1477",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Okni",
        "id_city": "1478",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Orla",
        "id_city": "1479",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Palamau",
        "id_city": "1481",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Phusro",
        "id_city": "1488",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Pondar Kanali",
        "id_city": "1489",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Rehla",
        "id_city": "1494",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Vadodara",
        "id_city": "1068",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Veraval",
        "id_city": "1081",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vinchhiya",
        "id_city": "1085",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Virpur",
        "id_city": "1087",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Beri",
        "id_city": "1107",
        "state_name": "Haryana"
      },
      {
        "city_name": "Gurgaon",
        "id_city": "1126",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kalanwali",
        "id_city": "1142",
        "state_name": "Haryana"
      },
      {
        "city_name": "Ropar",
        "id_city": "1182",
        "state_name": "Haryana"
      },
      {
        "city_name": "Sirsa",
        "id_city": "1189",
        "state_name": "Haryana"
      },
      {
        "city_name": "Tauru",
        "id_city": "1196",
        "state_name": "Haryana"
      },
      {
        "city_name": "Uklana Mandi",
        "id_city": "1202",
        "state_name": "Haryana"
      },
      {
        "city_name": "Bhota",
        "id_city": "1209",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Chaupal",
        "id_city": "1213",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Dhalli",
        "id_city": "1221",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Manali",
        "id_city": "1237",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Santokhgarh",
        "id_city": "1258",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Jourian",
        "id_city": "1306",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Katra",
        "id_city": "1309",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Lakhenpur",
        "id_city": "1319",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Pahalgam",
        "id_city": "1324",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Ramnagar",
        "id_city": "1334",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Srinagar",
        "id_city": "1341",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Amlabad",
        "id_city": "1351",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bagbahra",
        "id_city": "1355",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bhagatdih",
        "id_city": "1369",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chhatatanr",
        "id_city": "1385",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Dugda",
        "id_city": "1399",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jagannathpur",
        "id_city": "1423",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Katras",
        "id_city": "1441",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kharkhari",
        "id_city": "1444",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kuju",
        "id_city": "1451",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kurpania",
        "id_city": "1452",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Marma",
        "id_city": "1466",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Muri",
        "id_city": "1472",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Paratdih",
        "id_city": "1485",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Pathardih",
        "id_city": "1486",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ranoli",
        "id_city": "1016",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sanand",
        "id_city": "1020",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sankheda",
        "id_city": "1021",
        "state_name": "Gujarat"
      },
      {
        "city_name": "V.V. Nagar",
        "id_city": "1064",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Bawal",
        "id_city": "1105",
        "state_name": "Haryana"
      },
      {
        "city_name": "Charkhi Dadri",
        "id_city": "1111",
        "state_name": "Haryana"
      },
      {
        "city_name": "Dabwali",
        "id_city": "1114",
        "state_name": "Haryana"
      },
      {
        "city_name": "Dharuhera",
        "id_city": "1115",
        "state_name": "Haryana"
      },
      {
        "city_name": "Sukhrali",
        "id_city": "1193",
        "state_name": "Haryana"
      },
      {
        "city_name": "Yamunanagar",
        "id_city": "1204",
        "state_name": "Haryana"
      },
      {
        "city_name": "Damtal",
        "id_city": "1218",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Dera Gopipur",
        "id_city": "1220",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Sarahan",
        "id_city": "1259",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Talai",
        "id_city": "1268",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Anantnag",
        "id_city": "1275",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Billawar",
        "id_city": "1288",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Birwah",
        "id_city": "1289",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Gulmarg",
        "id_city": "1299",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Handwara",
        "id_city": "1301",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Jammu",
        "id_city": "1303",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Magam",
        "id_city": "1321",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Naushehra",
        "id_city": "1323",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Qazigund",
        "id_city": "1330",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Dumarkunda",
        "id_city": "1400",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Giridih",
        "id_city": "1408",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Godhar",
        "id_city": "1411",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jugsalai",
        "id_city": "1436",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kiri Buru",
        "id_city": "1448",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Mahesh Mundi",
        "id_city": "1461",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Mango",
        "id_city": "1464",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Saraidhela",
        "id_city": "1499",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Parvat",
        "id_city": "1002",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Raiya",
        "id_city": "1010",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Shahwadi",
        "id_city": "1028",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Thangadh",
        "id_city": "1048",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Udyognagar",
        "id_city": "1051",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Unjha",
        "id_city": "1059",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vadla",
        "id_city": "1066",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Panipat Taraf Ansar",
        "id_city": "1169",
        "state_name": "Haryana"
      },
      {
        "city_name": "Punahana",
        "id_city": "1174",
        "state_name": "Haryana"
      },
      {
        "city_name": "Bhuntar",
        "id_city": "1210",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Ghamarwin",
        "id_city": "1224",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Kullu",
        "id_city": "1235",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Nadaun",
        "id_city": "1241",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Daltenganj",
        "id_city": "1390",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Dari",
        "id_city": "1392",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jhumri Tilaiya",
        "id_city": "1434",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Manoharpur",
        "id_city": "1465",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Mugma",
        "id_city": "1471",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Umrala",
        "id_city": "1055",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Umreth",
        "id_city": "1056",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Valsad",
        "id_city": "1072",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Asandh",
        "id_city": "1099",
        "state_name": "Haryana"
      },
      {
        "city_name": "Bahadurgarh",
        "id_city": "1102",
        "state_name": "Haryana"
      },
      {
        "city_name": "Narwana",
        "id_city": "1163",
        "state_name": "Haryana"
      },
      {
        "city_name": "Panchkula",
        "id_city": "1167",
        "state_name": "Haryana"
      },
      {
        "city_name": "Pundri",
        "id_city": "1175",
        "state_name": "Haryana"
      },
      {
        "city_name": "Sankhol",
        "id_city": "1186",
        "state_name": "Haryana"
      },
      {
        "city_name": "Sohna",
        "id_city": "1191",
        "state_name": "Haryana"
      },
      {
        "city_name": "Jawala Mukhi",
        "id_city": "1226",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Rohru",
        "id_city": "1256",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Sundernagar",
        "id_city": "1267",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Arnia",
        "id_city": "1276",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kukernag",
        "id_city": "1315",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Pattan",
        "id_city": "1327",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Sunderbani",
        "id_city": "1343",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Barhi",
        "id_city": "1361",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bhuli",
        "id_city": "1372",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bundu",
        "id_city": "1375",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Khunti",
        "id_city": "1447",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kustai",
        "id_city": "1453",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Palawa",
        "id_city": "1482",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Rajula",
        "id_city": "1013",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sidhpur",
        "id_city": "1032",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sola",
        "id_city": "1038",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Wadhwan",
        "id_city": "1091",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Firozpur Jhirka",
        "id_city": "1122",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kaithal",
        "id_city": "1140",
        "state_name": "Haryana"
      },
      {
        "city_name": "Rohtak",
        "id_city": "1181",
        "state_name": "Haryana"
      },
      {
        "city_name": "Tohana",
        "id_city": "1199",
        "state_name": "Haryana"
      },
      {
        "city_name": "Gagret",
        "id_city": "1223",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Jogindarnagar",
        "id_city": "1227",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Kulu",
        "id_city": "1236",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Mehatpur Basdehra",
        "id_city": "1240",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Naina Devi",
        "id_city": "1244",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Solan",
        "id_city": "1264",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Bandipur",
        "id_city": "1279",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Duru-Verinag",
        "id_city": "1295",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Gandarbat",
        "id_city": "1296",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Khrew",
        "id_city": "1312",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Punch",
        "id_city": "1329",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Shupiyan",
        "id_city": "1339",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Chakulia",
        "id_city": "1379",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Deoghar",
        "id_city": "1393",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Haludbani",
        "id_city": "1417",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jhinkpani",
        "id_city": "1433",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Khelari",
        "id_city": "1446",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Meghahatuburu Forest village",
        "id_city": "1467",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Mera",
        "id_city": "1468",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Panrra",
        "id_city": "1484",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Shapar",
        "id_city": "1029",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Surat",
        "id_city": "1041",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Tarsali",
        "id_city": "1047",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Tharad",
        "id_city": "1049",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Un",
        "id_city": "1057",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vadnagar",
        "id_city": "1067",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ambala",
        "id_city": "1096",
        "state_name": "Haryana"
      },
      {
        "city_name": "Bawani Khera",
        "id_city": "1106",
        "state_name": "Haryana"
      },
      {
        "city_name": "Chita",
        "id_city": "1113",
        "state_name": "Haryana"
      },
      {
        "city_name": "Farakhpur",
        "id_city": "1118",
        "state_name": "Haryana"
      },
      {
        "city_name": "Gohana",
        "id_city": "1125",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kalka",
        "id_city": "1144",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kharkhoda",
        "id_city": "1149",
        "state_name": "Haryana"
      },
      {
        "city_name": "Ladwa",
        "id_city": "1154",
        "state_name": "Haryana"
      },
      {
        "city_name": "Palwal",
        "id_city": "1166",
        "state_name": "Haryana"
      },
      {
        "city_name": "Shahabad",
        "id_city": "1188",
        "state_name": "Haryana"
      },
      {
        "city_name": "Taoru",
        "id_city": "1194",
        "state_name": "Haryana"
      },
      {
        "city_name": "Dharamshala",
        "id_city": "1222",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Kasauli",
        "id_city": "1233",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Nagrota",
        "id_city": "1242",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Yol",
        "id_city": "1272",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Baramula",
        "id_city": "1281",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Batote",
        "id_city": "1285",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Bhaderwah",
        "id_city": "1286",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Gorah Salathian",
        "id_city": "1298",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Hiranagar",
        "id_city": "1302",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Pampore",
        "id_city": "1325",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Rehambal",
        "id_city": "1337",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Sopur",
        "id_city": "1340",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Barajamda",
        "id_city": "1360",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Borio Bazar",
        "id_city": "1374",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Gobindpur",
        "id_city": "1409",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jharia Khas",
        "id_city": "1432",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Nagri Kalan",
        "id_city": "1474",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Parnera",
        "id_city": "1001",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Salaya",
        "id_city": "1019",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sayla",
        "id_city": "1026",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Shahpur",
        "id_city": "1027",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Singarva",
        "id_city": "1035",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sinor",
        "id_city": "1036",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Songadh",
        "id_city": "1039",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Talaja",
        "id_city": "1043",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Thasra",
        "id_city": "1050",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vallabh Vidyanagar",
        "id_city": "1071",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Fatehabad",
        "id_city": "1121",
        "state_name": "Haryana"
      },
      {
        "city_name": "Hathin",
        "id_city": "1130",
        "state_name": "Haryana"
      },
      {
        "city_name": "Jakhal Mandi",
        "id_city": "1136",
        "state_name": "Haryana"
      },
      {
        "city_name": "Julana",
        "id_city": "1139",
        "state_name": "Haryana"
      },
      {
        "city_name": "Mustafabad",
        "id_city": "1158",
        "state_name": "Haryana"
      },
      {
        "city_name": "Pinjaur",
        "id_city": "1173",
        "state_name": "Haryana"
      },
      {
        "city_name": "Samalkha",
        "id_city": "1185",
        "state_name": "Haryana"
      },
      {
        "city_name": "Arki",
        "id_city": "1205",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Samba",
        "id_city": "1338",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Devghar",
        "id_city": "1395",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Gadhra",
        "id_city": "1403",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jamshedpur",
        "id_city": "1425",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jaridih",
        "id_city": "1428",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jena",
        "id_city": "1430",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Loiya",
        "id_city": "1458",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Mihijam",
        "id_city": "1470",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Rajmahal",
        "id_city": "1490",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ramgarh",
        "id_city": "1491",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Petlad",
        "id_city": "1005",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Prantij",
        "id_city": "1008",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Rajpipla",
        "id_city": "1012",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Hasanpur",
        "id_city": "1129",
        "state_name": "Haryana"
      },
      {
        "city_name": "Panipat Taraf Rajputan",
        "id_city": "1171",
        "state_name": "Haryana"
      },
      {
        "city_name": "Tilpat",
        "id_city": "1198",
        "state_name": "Haryana"
      },
      {
        "city_name": "Tosham",
        "id_city": "1200",
        "state_name": "Haryana"
      },
      {
        "city_name": "Uncha Siwana",
        "id_city": "1203",
        "state_name": "Haryana"
      },
      {
        "city_name": "Banjar",
        "id_city": "1208",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Dalhousie",
        "id_city": "1216",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Kot Khai",
        "id_city": "1234",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Sundarnagar",
        "id_city": "1266",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Banihal",
        "id_city": "1280",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Bijbiara",
        "id_city": "1287",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kargil",
        "id_city": "1307",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Rajauri",
        "id_city": "1331",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Balkundra",
        "id_city": "1358",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bermo",
        "id_city": "1368",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chaibasa",
        "id_city": "1376",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chas",
        "id_city": "1383",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chhotaputki",
        "id_city": "1386",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Dhanbad",
        "id_city": "1396",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Gua",
        "id_city": "1414",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Isri",
        "id_city": "1421",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jasidih",
        "id_city": "1429",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Lakarka",
        "id_city": "1454",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Loyabad",
        "id_city": "1459",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Patan",
        "id_city": "1003",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Petrochemical Complex",
        "id_city": "1006",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Santrampur",
        "id_city": "1022",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sarigam INA",
        "id_city": "1024",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ukai",
        "id_city": "1052",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vanthali",
        "id_city": "1074",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Dundahera",
        "id_city": "1116",
        "state_name": "Haryana"
      },
      {
        "city_name": "Faridabad",
        "id_city": "1119",
        "state_name": "Haryana"
      },
      {
        "city_name": "Hisar",
        "id_city": "1131",
        "state_name": "Haryana"
      },
      {
        "city_name": "Panipat",
        "id_city": "1168",
        "state_name": "Haryana"
      },
      {
        "city_name": "Rania",
        "id_city": "1178",
        "state_name": "Haryana"
      },
      {
        "city_name": "Sadauri",
        "id_city": "1183",
        "state_name": "Haryana"
      },
      {
        "city_name": "Thanesar",
        "id_city": "1197",
        "state_name": "Haryana"
      },
      {
        "city_name": "Hamirpur",
        "id_city": "1225",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Kala Amb",
        "id_city": "1230",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Seoni",
        "id_city": "1261",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Sirmaur",
        "id_city": "1263",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Theog",
        "id_city": "1269",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Una",
        "id_city": "1271",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Jammu Cantonment",
        "id_city": "1304",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Ramban",
        "id_city": "1332",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Ramgarh",
        "id_city": "1333",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Sumbal",
        "id_city": "1342",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Chaitudih",
        "id_city": "1377",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chakradharpur",
        "id_city": "1378",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chandaur",
        "id_city": "1380",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Gidi",
        "id_city": "1407",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jharia",
        "id_city": "1431",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kenduadih",
        "id_city": "1443",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kodarma",
        "id_city": "1450",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Mushabani",
        "id_city": "1473",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Netarhat",
        "id_city": "1475",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Nirsa",
        "id_city": "1476",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Panchet",
        "id_city": "1483",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Rohraband",
        "id_city": "1496",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Sahij",
        "id_city": "1018",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Shivrajpur",
        "id_city": "1030",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sihor",
        "id_city": "1033",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Sika",
        "id_city": "1034",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Talod",
        "id_city": "1045",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Utran",
        "id_city": "1061",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Uttarsanda",
        "id_city": "1062",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Valsad INA",
        "id_city": "1073",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vidyanagar",
        "id_city": "1082",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Waghodia",
        "id_city": "1093",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Zalod",
        "id_city": "1095",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Barwala",
        "id_city": "1104",
        "state_name": "Haryana"
      },
      {
        "city_name": "Bhiwani",
        "id_city": "1108",
        "state_name": "Haryana"
      },
      {
        "city_name": "Farrukhnagar",
        "id_city": "1120",
        "state_name": "Haryana"
      },
      {
        "city_name": "Hissar",
        "id_city": "1132",
        "state_name": "Haryana"
      },
      {
        "city_name": "Hodal",
        "id_city": "1133",
        "state_name": "Haryana"
      },
      {
        "city_name": "Jind",
        "id_city": "1138",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kalanur",
        "id_city": "1141",
        "state_name": "Haryana"
      },
      {
        "city_name": "Mandi",
        "id_city": "1238",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Mant Khas",
        "id_city": "1239",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Parwanoo",
        "id_city": "1251",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Parwanu",
        "id_city": "1252",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Bashohli",
        "id_city": "1284",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Jammu Tawi",
        "id_city": "1305",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Parole",
        "id_city": "1326",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Ranbirsingh Pora",
        "id_city": "1335",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Vijaypur",
        "id_city": "1349",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Barwadih",
        "id_city": "1365",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bokaro",
        "id_city": "1373",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Dhanwar",
        "id_city": "1397",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ghatsila",
        "id_city": "1405",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kharsawan",
        "id_city": "1445",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Lohardaga",
        "id_city": "1457",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Patratu",
        "id_city": "1487",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Sahibganj",
        "id_city": "1497",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Patdi",
        "id_city": "1004",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Radhanpur",
        "id_city": "1009",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Rajkot",
        "id_city": "1011",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Saribujrang",
        "id_city": "1023",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Suraj Karadi",
        "id_city": "1040",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Una",
        "id_city": "1058",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vaghodia INA",
        "id_city": "1069",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vapi",
        "id_city": "1075",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vasad",
        "id_city": "1078",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vijapur",
        "id_city": "1084",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Asan Khurd",
        "id_city": "1098",
        "state_name": "Haryana"
      },
      {
        "city_name": "Babiyal",
        "id_city": "1101",
        "state_name": "Haryana"
      },
      {
        "city_name": "Chhachhrauli",
        "id_city": "1112",
        "state_name": "Haryana"
      },
      {
        "city_name": "Gannaur",
        "id_city": "1123",
        "state_name": "Haryana"
      },
      {
        "city_name": "Jhajjar",
        "id_city": "1137",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kardhan",
        "id_city": "1147",
        "state_name": "Haryana"
      },
      {
        "city_name": "Mahendragarh",
        "id_city": "1157",
        "state_name": "Haryana"
      },
      {
        "city_name": "Pehowa",
        "id_city": "1172",
        "state_name": "Haryana"
      },
      {
        "city_name": "Dagshai",
        "id_city": "1215",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Kangra",
        "id_city": "1232",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Narkanda",
        "id_city": "1246",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Rawalsar",
        "id_city": "1255",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Budgam",
        "id_city": "1291",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Chenani",
        "id_city": "1293",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Khan Sahib",
        "id_city": "1310",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Mattan",
        "id_city": "1322",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Thanamandi",
        "id_city": "1345",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Ara",
        "id_city": "1353",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bhaurah",
        "id_city": "1370",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chandil",
        "id_city": "1381",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chirkunda",
        "id_city": "1388",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Danguwapasi",
        "id_city": "1391",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Golphalbari",
        "id_city": "1412",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kalikapur",
        "id_city": "1438",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ramod",
        "id_city": "1014",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Tankara",
        "id_city": "1046",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vyara",
        "id_city": "1090",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ateli",
        "id_city": "1100",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kalayat",
        "id_city": "1143",
        "state_name": "Haryana"
      },
      {
        "city_name": "Nagai Chaudhry",
        "id_city": "1159",
        "state_name": "Haryana"
      },
      {
        "city_name": "Narnaul",
        "id_city": "1161",
        "state_name": "Haryana"
      },
      {
        "city_name": "Panipat Taraf Makhdum Zadgan",
        "id_city": "1170",
        "state_name": "Haryana"
      },
      {
        "city_name": "Taraori",
        "id_city": "1195",
        "state_name": "Haryana"
      },
      {
        "city_name": "Chuari Khas",
        "id_city": "1214",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Daulatpur",
        "id_city": "1219",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Nalagarh",
        "id_city": "1245",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Pandoh",
        "id_city": "1249",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Bari Brahmana",
        "id_city": "1283",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kishtwar",
        "id_city": "1313",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kud",
        "id_city": "1314",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Uri",
        "id_city": "1348",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Adityapur",
        "id_city": "1350",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Baliari",
        "id_city": "1357",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Barka Kana",
        "id_city": "1362",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Barughutu",
        "id_city": "1364",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chandrapura",
        "id_city": "1382",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Deorikalan",
        "id_city": "1394",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kiriburu",
        "id_city": "1449",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Latehar",
        "id_city": "1456",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Madhupur",
        "id_city": "1460",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Meru",
        "id_city": "1469",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Saraikela",
        "id_city": "1500",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Porbandar",
        "id_city": "1007",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Rapar",
        "id_city": "1017",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Talala",
        "id_city": "1044",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Umbergaon",
        "id_city": "1053",
        "state_name": "Gujarat"
      },
      {
        "city_name": "V.U. Nagar",
        "id_city": "1063",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Valbhipur",
        "id_city": "1070",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vasna Borsad INA",
        "id_city": "1079",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Visnagar",
        "id_city": "1089",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Wankaner",
        "id_city": "1094",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ellenabad",
        "id_city": "1117",
        "state_name": "Haryana"
      },
      {
        "city_name": "Ghraunda",
        "id_city": "1124",
        "state_name": "Haryana"
      },
      {
        "city_name": "Haileymandi",
        "id_city": "1127",
        "state_name": "Haryana"
      },
      {
        "city_name": "Indri",
        "id_city": "1134",
        "state_name": "Haryana"
      },
      {
        "city_name": "Jagadhri",
        "id_city": "1135",
        "state_name": "Haryana"
      },
      {
        "city_name": "Ladrawan",
        "id_city": "1153",
        "state_name": "Haryana"
      },
      {
        "city_name": "Nuh",
        "id_city": "1165",
        "state_name": "Haryana"
      },
      {
        "city_name": "Radaur",
        "id_city": "1176",
        "state_name": "Haryana"
      },
      {
        "city_name": "Safidon",
        "id_city": "1184",
        "state_name": "Haryana"
      },
      {
        "city_name": "Baddi",
        "id_city": "1206",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Bakloh",
        "id_city": "1207",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Badami Bagh",
        "id_city": "1278",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Doda",
        "id_city": "1294",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Hajan",
        "id_city": "1300",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kathua",
        "id_city": "1308",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kulgam",
        "id_city": "1316",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Talwara",
        "id_city": "1344",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Angarpathar",
        "id_city": "1352",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Baliapur",
        "id_city": "1356",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Basaria",
        "id_city": "1366",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bhojudih",
        "id_city": "1371",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Churi",
        "id_city": "1389",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Dumka",
        "id_city": "1401",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Gumla",
        "id_city": "1416",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Hesla",
        "id_city": "1419",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jorapokhar",
        "id_city": "1435",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kailudih",
        "id_city": "1437",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Malkera",
        "id_city": "1463",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Vapi INA",
        "id_city": "1076",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vijalpor",
        "id_city": "1083",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Vinzol",
        "id_city": "1086",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Visavadar",
        "id_city": "1088",
        "state_name": "Gujarat"
      },
      {
        "city_name": "Ambala Cantt",
        "id_city": "1097",
        "state_name": "Haryana"
      },
      {
        "city_name": "Ballabgarh",
        "id_city": "1103",
        "state_name": "Haryana"
      },
      {
        "city_name": "Bilaspur",
        "id_city": "1109",
        "state_name": "Haryana"
      },
      {
        "city_name": "Kurukshetra",
        "id_city": "1152",
        "state_name": "Haryana"
      },
      {
        "city_name": "Maham",
        "id_city": "1156",
        "state_name": "Haryana"
      },
      {
        "city_name": "Narayangarh",
        "id_city": "1160",
        "state_name": "Haryana"
      },
      {
        "city_name": "Narnaund",
        "id_city": "1162",
        "state_name": "Haryana"
      },
      {
        "city_name": "Nilokheri",
        "id_city": "1164",
        "state_name": "Haryana"
      },
      {
        "city_name": "Ratiya",
        "id_city": "1179",
        "state_name": "Haryana"
      },
      {
        "city_name": "Rewari",
        "id_city": "1180",
        "state_name": "Haryana"
      },
      {
        "city_name": "Jubbal",
        "id_city": "1228",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Nurpur",
        "id_city": "1247",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Palampur",
        "id_city": "1248",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Sabathu",
        "id_city": "1257",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Sarka Ghat",
        "id_city": "1260",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Shimla",
        "id_city": "1262",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Tira Sujanpur",
        "id_city": "1270",
        "state_name": "Himachal Pradesh"
      },
      {
        "city_name": "Achabal",
        "id_city": "1273",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Akhnur",
        "id_city": "1274",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Gho Manhasan",
        "id_city": "1297",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kunzer",
        "id_city": "1317",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Kupwara",
        "id_city": "1318",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Leh",
        "id_city": "1320",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Tral",
        "id_city": "1346",
        "state_name": "Jammu and Kashmir"
      },
      {
        "city_name": "Babua Kalan",
        "id_city": "1354",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Chiria",
        "id_city": "1387",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Garwa",
        "id_city": "1404",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Husainabad",
        "id_city": "1420",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Jarangdih",
        "id_city": "1427",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kandra",
        "id_city": "1439",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kanke",
        "id_city": "1440",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Kedla",
        "id_city": "1442",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Pakaur",
        "id_city": "1480",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Religara",
        "id_city": "1495",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Sindari",
        "id_city": "1507",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Surubera",
        "id_city": "1512",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Topa",
        "id_city": "1516",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ankola",
        "id_city": "1528",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Aurad",
        "id_city": "1533",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Badami",
        "id_city": "1535",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bankapura",
        "id_city": "1544",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chamrajnagar",
        "id_city": "1574",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gauribidanur",
        "id_city": "1607",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hunasagi",
        "id_city": "1649",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Huvina Hadagalli",
        "id_city": "1653",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kanakapura",
        "id_city": "1665",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kushtagi",
        "id_city": "1704",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Munnur",
        "id_city": "1748",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Naravi",
        "id_city": "1755",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sedam",
        "id_city": "1789",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shahabad",
        "id_city": "1790",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sira",
        "id_city": "1806",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sulya",
        "id_city": "1815",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Thokur",
        "id_city": "1821",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Alappuzha",
        "id_city": "1848",
        "state_name": "Kerala"
      },
      {
        "city_name": "Angamaly",
        "id_city": "1851",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chelakkara",
        "id_city": "1868",
        "state_name": "Kerala"
      },
      {
        "city_name": "Cherthala",
        "id_city": "1875",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kanjirappalli",
        "id_city": "1917",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kannangad",
        "id_city": "1919",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kedamangalam",
        "id_city": "1929",
        "state_name": "Kerala"
      },
      {
        "city_name": "Komalapuram",
        "id_city": "1938",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kudappanakunnu",
        "id_city": "1948",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mallappally",
        "id_city": "1961",
        "state_name": "Kerala"
      },
      {
        "city_name": "Narath",
        "id_city": "1985",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ajjampur",
        "id_city": "1521",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bantwal",
        "id_city": "1546",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Belvata",
        "id_city": "1557",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Channarayapatna",
        "id_city": "1578",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chickballapur",
        "id_city": "1579",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chik Ballapur",
        "id_city": "1580",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chintamani",
        "id_city": "1586",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Devadurga",
        "id_city": "1595",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Dharwar",
        "id_city": "1598",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Dhupdal",
        "id_city": "1599",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gorur",
        "id_city": "1611",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hatti Gold Mines",
        "id_city": "1625",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hebbalu",
        "id_city": "1628",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hiriyur",
        "id_city": "1635",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hole Narsipur",
        "id_city": "1637",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Honnali",
        "id_city": "1640",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hungund",
        "id_city": "1651",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kabini Colony",
        "id_city": "1660",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Karkala",
        "id_city": "1669",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Konanakunte",
        "id_city": "1680",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Krishnarajanagar",
        "id_city": "1690",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kunigal",
        "id_city": "1701",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Londa",
        "id_city": "1708",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Magadi",
        "id_city": "1712",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Manipal",
        "id_city": "1727",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mulbagal",
        "id_city": "1741",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mysore",
        "id_city": "1750",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Pattanagere",
        "id_city": "1765",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Siddapur",
        "id_city": "1802",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sringeri",
        "id_city": "1813",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Suntikopa",
        "id_city": "1816",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Thumbe",
        "id_city": "1822",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Udupi",
        "id_city": "1829",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Venkatapura",
        "id_city": "1832",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Yadgir",
        "id_city": "1837",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Adoor",
        "id_city": "1844",
        "state_name": "Kerala"
      },
      {
        "city_name": "Alangad",
        "id_city": "1847",
        "state_name": "Kerala"
      },
      {
        "city_name": "Dharmadam",
        "id_city": "1885",
        "state_name": "Kerala"
      },
      {
        "city_name": "Iriveri",
        "id_city": "1902",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kannur Cantonment",
        "id_city": "1922",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kasargod",
        "id_city": "1926",
        "state_name": "Kerala"
      },
      {
        "city_name": "Marathakkara",
        "id_city": "1968",
        "state_name": "Kerala"
      },
      {
        "city_name": "Methala",
        "id_city": "1974",
        "state_name": "Kerala"
      },
      {
        "city_name": "Palai",
        "id_city": "1996",
        "state_name": "Kerala"
      },
      {
        "city_name": "Saunda",
        "id_city": "1502",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Bhatkal",
        "id_city": "1561",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chamundi Betta",
        "id_city": "1575",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gokak Falls",
        "id_city": "1609",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gulbarga",
        "id_city": "1615",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hidkal",
        "id_city": "1632",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kengeri",
        "id_city": "1672",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kotturu",
        "id_city": "1688",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Krishnapura",
        "id_city": "1689",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kumta",
        "id_city": "1698",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Magod Falls",
        "id_city": "1713",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Naregal",
        "id_city": "1757",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shahpur",
        "id_city": "1793",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Yelbarga",
        "id_city": "1840",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chalakudi",
        "id_city": "1864",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chavakkad",
        "id_city": "1867",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kalliasseri",
        "id_city": "1911",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kannapuram",
        "id_city": "1920",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kasaragod",
        "id_city": "1925",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kodamthuruthu",
        "id_city": "1931",
        "state_name": "Kerala"
      },
      {
        "city_name": "Manjeri",
        "id_city": "1962",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mavelikara",
        "id_city": "1971",
        "state_name": "Kerala"
      },
      {
        "city_name": "Nenmenikkara",
        "id_city": "1988",
        "state_name": "Kerala"
      },
      {
        "city_name": "Olavanna",
        "id_city": "1992",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sarjamda",
        "id_city": "1501",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Simdega",
        "id_city": "1506",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Annigeri",
        "id_city": "1529",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bagalkot",
        "id_city": "1536",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Belur",
        "id_city": "1556",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bijapur",
        "id_city": "1565",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chikmagalur",
        "id_city": "1582",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chikodi",
        "id_city": "1584",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hukeri",
        "id_city": "1648",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Karwar",
        "id_city": "1670",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Konnur",
        "id_city": "1682",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Maski",
        "id_city": "1729",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Melukote",
        "id_city": "1732",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mudhol",
        "id_city": "1738",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ramanagaram",
        "id_city": "1772",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ron",
        "id_city": "1777",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sagar",
        "id_city": "1779",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Saligram",
        "id_city": "1781",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sanivarsante",
        "id_city": "1783",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ancharakandy",
        "id_city": "1850",
        "state_name": "Kerala"
      },
      {
        "city_name": "Cheruvannur",
        "id_city": "1878",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kokkothamangalam",
        "id_city": "1935",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kollam",
        "id_city": "1937",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kottarakkara",
        "id_city": "1942",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mavur",
        "id_city": "1973",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mundakayam",
        "id_city": "1977",
        "state_name": "Kerala"
      },
      {
        "city_name": "Nadapuram",
        "id_city": "1983",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ottapalam",
        "id_city": "1993",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sijua",
        "id_city": "1505",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Almatti Sitimani",
        "id_city": "1523",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Alur",
        "id_city": "1525",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Banavar",
        "id_city": "1542",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bengaluru",
        "id_city": "1558",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gajendragarh",
        "id_city": "1603",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ganeshgudi",
        "id_city": "1604",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Harihar",
        "id_city": "1621",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Herohalli",
        "id_city": "1631",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Holalkere",
        "id_city": "1636",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kodigenahalli",
        "id_city": "1675",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kolar",
        "id_city": "1678",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Koratagere",
        "id_city": "1685",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kotekara",
        "id_city": "1686",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kudchi",
        "id_city": "1694",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Maddur",
        "id_city": "1709",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Malavalli",
        "id_city": "1719",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mundargi",
        "id_city": "1745",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Nelmangala",
        "id_city": "1759",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Padu",
        "id_city": "1763",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Robertsonpet",
        "id_city": "1776",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sankeshwar",
        "id_city": "1784",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Saundatti Yellamma",
        "id_city": "1787",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Siruguppa",
        "id_city": "1809",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Someshwar",
        "id_city": "1810",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Wadi",
        "id_city": "1835",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Arukutti",
        "id_city": "1853",
        "state_name": "Kerala"
      },
      {
        "city_name": "Changanacheri",
        "id_city": "1865",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chirakkal",
        "id_city": "1881",
        "state_name": "Kerala"
      },
      {
        "city_name": "Manjeshwar",
        "id_city": "1963",
        "state_name": "Kerala"
      },
      {
        "city_name": "Muthakunnam",
        "id_city": "1980",
        "state_name": "Kerala"
      },
      {
        "city_name": "Adityapatna",
        "id_city": "1519",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Anekal",
        "id_city": "1527",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bangarapet",
        "id_city": "1543",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Belgaum",
        "id_city": "1551",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gangoli",
        "id_city": "1606",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hassan",
        "id_city": "1623",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hindalgi",
        "id_city": "1633",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hosdurga",
        "id_city": "1644",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Jagalur",
        "id_city": "1656",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kannur",
        "id_city": "1668",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kodiyal",
        "id_city": "1676",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Nagamangala",
        "id_city": "1751",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Pavagada",
        "id_city": "1766",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Rabkavi",
        "id_city": "1770",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Virarajendrapet",
        "id_city": "1834",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Attingal",
        "id_city": "1854",
        "state_name": "Kerala"
      },
      {
        "city_name": "Avinissery",
        "id_city": "1855",
        "state_name": "Kerala"
      },
      {
        "city_name": "Edathala",
        "id_city": "1887",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kalamassery",
        "id_city": "1910",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kanjikkuzhi",
        "id_city": "1915",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kattappana",
        "id_city": "1927",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kodungallur",
        "id_city": "1932",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kozhikode",
        "id_city": "1947",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kurikkad",
        "id_city": "1954",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kuttur",
        "id_city": "1959",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mavilayi",
        "id_city": "1972",
        "state_name": "Kerala"
      },
      {
        "city_name": "Bhadravati",
        "id_city": "1559",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bhalki",
        "id_city": "1560",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bhimarayanagudi",
        "id_city": "1562",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Byatarayanapura",
        "id_city": "1571",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gangawati",
        "id_city": "1605",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gottikere",
        "id_city": "1612",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Harpanahalli",
        "id_city": "1622",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hoskote",
        "id_city": "1645",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hubli",
        "id_city": "1647",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Jog Falls",
        "id_city": "1659",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kemminja",
        "id_city": "1671",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kodlipet",
        "id_city": "1677",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Krishnarajapura",
        "id_city": "1691",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kurgunta",
        "id_city": "1702",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Maisuru",
        "id_city": "1717",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Manchenahalli",
        "id_city": "1723",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mangalore",
        "id_city": "1725",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mudalgi",
        "id_city": "1734",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mudushedde",
        "id_city": "1740",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mundgod",
        "id_city": "1746",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Narayanpur",
        "id_city": "1756",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Raichur",
        "id_city": "1771",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sakleshpur",
        "id_city": "1780",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shahapur",
        "id_city": "1792",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Talikota",
        "id_city": "1817",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Tarikera",
        "id_city": "1818",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Terdal",
        "id_city": "1820",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Yelandur",
        "id_city": "1839",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chengannur",
        "id_city": "1872",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chittur",
        "id_city": "1882",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kadalundi",
        "id_city": "1904",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kadungallur",
        "id_city": "1907",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kottayam Malabar",
        "id_city": "1944",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mannar",
        "id_city": "1965",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mulavukad",
        "id_city": "1976",
        "state_name": "Kerala"
      },
      {
        "city_name": "Nileshwar",
        "id_city": "1991",
        "state_name": "Kerala"
      },
      {
        "city_name": "Palakkad",
        "id_city": "1997",
        "state_name": "Kerala"
      },
      {
        "city_name": "Tati",
        "id_city": "1513",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Ambikanagara",
        "id_city": "1526",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Badagavettu",
        "id_city": "1534",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bagepalli",
        "id_city": "1537",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bajala",
        "id_city": "1540",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chiknayakanhalli",
        "id_city": "1583",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Guledgudda",
        "id_city": "1616",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hangal",
        "id_city": "1620",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hebbagodi",
        "id_city": "1627",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hospet",
        "id_city": "1646",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kangrali KH",
        "id_city": "1667",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kothnur",
        "id_city": "1687",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kudremukh",
        "id_city": "1696",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kyathanahalli",
        "id_city": "1705",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Lakshmeshwar",
        "id_city": "1706",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Madhugiri",
        "id_city": "1710",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mahadeswara Hills",
        "id_city": "1714",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mulur",
        "id_city": "1744",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Munirabad",
        "id_city": "1747",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Raybag",
        "id_city": "1775",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sathyamangala",
        "id_city": "1786",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shahabad A.C.C.",
        "id_city": "1791",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sirakoppa",
        "id_city": "1807",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Vijayapura",
        "id_city": "1833",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Beypur",
        "id_city": "1861",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chauwara",
        "id_city": "1866",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chelora",
        "id_city": "1869",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chendamangalam",
        "id_city": "1870",
        "state_name": "Kerala"
      },
      {
        "city_name": "Cherukunnu",
        "id_city": "1876",
        "state_name": "Kerala"
      },
      {
        "city_name": "Churnikkara",
        "id_city": "1884",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ernakulam",
        "id_city": "1892",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ettumanoor",
        "id_city": "1894",
        "state_name": "Kerala"
      },
      {
        "city_name": "Hosabettu",
        "id_city": "1898",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kanhirode",
        "id_city": "1914",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mannancherry",
        "id_city": "1964",
        "state_name": "Kerala"
      },
      {
        "city_name": "Paduvilayi",
        "id_city": "1995",
        "state_name": "Kerala"
      },
      {
        "city_name": "Bilgi",
        "id_city": "1566",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bommasandra",
        "id_city": "1569",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Byadgi",
        "id_city": "1570",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Channagiri",
        "id_city": "1576",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Channapatna",
        "id_city": "1577",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chitaguppa",
        "id_city": "1587",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gokak",
        "id_city": "1608",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Haliyal",
        "id_city": "1619",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Honavar",
        "id_city": "1639",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kampli",
        "id_city": "1664",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kushalnagar",
        "id_city": "1703",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mahadevapura",
        "id_city": "1715",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mallar",
        "id_city": "1720",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mulgund",
        "id_city": "1742",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Naragund",
        "id_city": "1753",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bangramanjeshwar",
        "id_city": "1860",
        "state_name": "Kerala"
      },
      {
        "city_name": "Cheruvattur",
        "id_city": "1879",
        "state_name": "Kerala"
      },
      {
        "city_name": "Elur",
        "id_city": "1889",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kakkodi",
        "id_city": "1908",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kannadiparamba",
        "id_city": "1918",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kolazhy",
        "id_city": "1936",
        "state_name": "Kerala"
      },
      {
        "city_name": "Koyilandi",
        "id_city": "1946",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kumarakom",
        "id_city": "1950",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kunnamkulam",
        "id_city": "1953",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kuttikkattur",
        "id_city": "1958",
        "state_name": "Kerala"
      },
      {
        "city_name": "Palissery",
        "id_city": "1999",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sinduria",
        "id_city": "1508",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Aland",
        "id_city": "1522",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Basavana Bagevadi",
        "id_city": "1548",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bidar",
        "id_city": "1564",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chincholi",
        "id_city": "1585",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Devagiri",
        "id_city": "1596",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kerur",
        "id_city": "1673",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Krishnarajpet",
        "id_city": "1693",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Malur",
        "id_city": "1722",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Molakalmuru",
        "id_city": "1733",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mulki",
        "id_city": "1743",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Nyamati",
        "id_city": "1762",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Piriyapatna",
        "id_city": "1767",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Puttur",
        "id_city": "1769",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Somvarpet",
        "id_city": "1811",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Tonse",
        "id_city": "1826",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Yelahanka",
        "id_city": "1838",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Adimaly",
        "id_city": "1843",
        "state_name": "Kerala"
      },
      {
        "city_name": "Aroor",
        "id_city": "1852",
        "state_name": "Kerala"
      },
      {
        "city_name": "Erattupetta",
        "id_city": "1891",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kanjikode",
        "id_city": "1916",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kochi",
        "id_city": "1930",
        "state_name": "Kerala"
      },
      {
        "city_name": "Koduvayur",
        "id_city": "1934",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kudlu",
        "id_city": "1949",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kuthuparamba",
        "id_city": "1956",
        "state_name": "Kerala"
      },
      {
        "city_name": "Muhamma",
        "id_city": "1975",
        "state_name": "Kerala"
      },
      {
        "city_name": "Palayad",
        "id_city": "1998",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sijhua",
        "id_city": "1504",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Afzalpur",
        "id_city": "1520",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Challakere",
        "id_city": "1573",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gonikoppal",
        "id_city": "1610",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hirekerur",
        "id_city": "1634",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Homnabad",
        "id_city": "1638",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hunasamaranahalli",
        "id_city": "1650",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kalghatgi",
        "id_city": "1662",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Konanur",
        "id_city": "1681",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kudligi",
        "id_city": "1695",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mudgal",
        "id_city": "1737",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mudigere",
        "id_city": "1739",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ramdurg",
        "id_city": "1773",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shaktinagar",
        "id_city": "1794",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shikarpur",
        "id_city": "1796",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shirhatti",
        "id_city": "1798",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sindgi",
        "id_city": "1804",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sorab",
        "id_city": "1812",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Brahmakulam",
        "id_city": "1862",
        "state_name": "Kerala"
      },
      {
        "city_name": "Edappal",
        "id_city": "1886",
        "state_name": "Kerala"
      },
      {
        "city_name": "Feroke",
        "id_city": "1895",
        "state_name": "Kerala"
      },
      {
        "city_name": "Iringaprom",
        "id_city": "1900",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kanhangad",
        "id_city": "1913",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kayamkulam",
        "id_city": "1928",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kunnamangalam",
        "id_city": "1952",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kuttakulam",
        "id_city": "1957",
        "state_name": "Kerala"
      },
      {
        "city_name": "Munnar",
        "id_city": "1979",
        "state_name": "Kerala"
      },
      {
        "city_name": "New Mahe",
        "id_city": "1989",
        "state_name": "Kerala"
      },
      {
        "city_name": "Neyyattinkara",
        "id_city": "1990",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sirka",
        "id_city": "1510",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Tisra",
        "id_city": "1515",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Alnavar",
        "id_city": "1524",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bajpe",
        "id_city": "1541",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Belluru",
        "id_city": "1554",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bommanahalli",
        "id_city": "1568",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Dandeli",
        "id_city": "1591",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Donimalai",
        "id_city": "1601",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Heggadadevanakote",
        "id_city": "1630",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Jevargi",
        "id_city": "1658",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Khanapur",
        "id_city": "1674",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Krishnarajasagara",
        "id_city": "1692",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kundapura",
        "id_city": "1699",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Manvi",
        "id_city": "1728",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mastikatte Colony",
        "id_city": "1730",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Muddebihal",
        "id_city": "1736",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Nanjangud",
        "id_city": "1752",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sindhnur",
        "id_city": "1805",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ullal",
        "id_city": "1830",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Uttarahalli",
        "id_city": "1831",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Eranholi",
        "id_city": "1890",
        "state_name": "Kerala"
      },
      {
        "city_name": "Idukki",
        "id_city": "1899",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kadamakkudy",
        "id_city": "1905",
        "state_name": "Kerala"
      },
      {
        "city_name": "Koduvally",
        "id_city": "1933",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kottayam",
        "id_city": "1943",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kottuvally",
        "id_city": "1945",
        "state_name": "Kerala"
      },
      {
        "city_name": "Siuliban",
        "id_city": "1511",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Adityanagar",
        "id_city": "1518",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Belakavadiq",
        "id_city": "1550",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Beltangadi",
        "id_city": "1555",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Haveri",
        "id_city": "1626",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hosanagara",
        "id_city": "1642",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kadur",
        "id_city": "1661",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kamalapuram",
        "id_city": "1663",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Lingsugur",
        "id_city": "1707",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mahalingpur",
        "id_city": "1716",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ranibennur",
        "id_city": "1774",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sargur",
        "id_city": "1785",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shiggaon",
        "id_city": "1795",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shimoga",
        "id_city": "1797",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shravanabelagola",
        "id_city": "1800",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Srinivaspur",
        "id_city": "1814",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Turuvekere",
        "id_city": "1828",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chevvur",
        "id_city": "1880",
        "state_name": "Kerala"
      },
      {
        "city_name": "Elayavur",
        "id_city": "1888",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kannur",
        "id_city": "1921",
        "state_name": "Kerala"
      },
      {
        "city_name": "Koratty",
        "id_city": "1940",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kothamangalam",
        "id_city": "1941",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kurkkanchery",
        "id_city": "1955",
        "state_name": "Kerala"
      },
      {
        "city_name": "Muvattupuzha",
        "id_city": "1981",
        "state_name": "Kerala"
      },
      {
        "city_name": "Muzhappilangad",
        "id_city": "1982",
        "state_name": "Kerala"
      },
      {
        "city_name": "Nadathara",
        "id_city": "1984",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sewai",
        "id_city": "1503",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Sini",
        "id_city": "1509",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Baindur",
        "id_city": "1539",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chakranagar Colony",
        "id_city": "1572",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chikkaballapur",
        "id_city": "1581",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chitradurga",
        "id_city": "1589",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Coorg",
        "id_city": "1590",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Davangere",
        "id_city": "1594",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hosakote",
        "id_city": "1641",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ilkal",
        "id_city": "1654",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kangrali BK",
        "id_city": "1666",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Koppa",
        "id_city": "1683",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Madikeri",
        "id_city": "1711",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Maisuru Cantonment",
        "id_city": "1718",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Malpe",
        "id_city": "1721",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mangaluru",
        "id_city": "1726",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mudbidri",
        "id_city": "1735",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Murudeshwara",
        "id_city": "1749",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Narasimharajapura",
        "id_city": "1754",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Navalgund",
        "id_city": "1758",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Savanur",
        "id_city": "1788",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Tirthahalli",
        "id_city": "1824",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Tirumakudal Narsipur",
        "id_city": "1825",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Adur",
        "id_city": "1845",
        "state_name": "Kerala"
      },
      {
        "city_name": "Akathiyur",
        "id_city": "1846",
        "state_name": "Kerala"
      },
      {
        "city_name": "Balussery",
        "id_city": "1859",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chockli",
        "id_city": "1883",
        "state_name": "Kerala"
      },
      {
        "city_name": "Eruvatti",
        "id_city": "1893",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kalpetta",
        "id_city": "1912",
        "state_name": "Kerala"
      },
      {
        "city_name": "Karuvamyhuruthy",
        "id_city": "1924",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mannarakkat",
        "id_city": "1966",
        "state_name": "Kerala"
      },
      {
        "city_name": "Mattannur",
        "id_city": "1970",
        "state_name": "Kerala"
      },
      {
        "city_name": "Nattakam",
        "id_city": "1986",
        "state_name": "Kerala"
      },
      {
        "city_name": "Arkalgud",
        "id_city": "1530",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Belagula",
        "id_city": "1549",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bellary",
        "id_city": "1553",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bhogadi",
        "id_city": "1563",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Birur",
        "id_city": "1567",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Dasarahalli",
        "id_city": "1593",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Devanhalli",
        "id_city": "1597",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gadag",
        "id_city": "1602",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gubbi",
        "id_city": "1613",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gudibanda",
        "id_city": "1614",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gurmatkal",
        "id_city": "1618",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hebri",
        "id_city": "1629",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hosangadi",
        "id_city": "1643",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hunsur",
        "id_city": "1652",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Koppal",
        "id_city": "1684",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kumsi",
        "id_city": "1697",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mayakonda",
        "id_city": "1731",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Nipani",
        "id_city": "1760",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Nitte",
        "id_city": "1761",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Pandavapura",
        "id_city": "1764",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shorapur",
        "id_city": "1799",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Shrirangapattana",
        "id_city": "1801",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sirsi",
        "id_city": "1808",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Tumkur",
        "id_city": "1827",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Wadi A.C.C.",
        "id_city": "1836",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Yellapur",
        "id_city": "1841",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Azhikode South",
        "id_city": "1857",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chala",
        "id_city": "1863",
        "state_name": "Kerala"
      },
      {
        "city_name": "Chengamanad",
        "id_city": "1871",
        "state_name": "Kerala"
      },
      {
        "city_name": "Haripad",
        "id_city": "1897",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kalady",
        "id_city": "1909",
        "state_name": "Kerala"
      },
      {
        "city_name": "Malappuram",
        "id_city": "1960",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pallikkunnu",
        "id_city": "2000",
        "state_name": "Kerala"
      },
      {
        "city_name": "Tenudam",
        "id_city": "1514",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Topchanchi",
        "id_city": "1517",
        "state_name": "Jharkhand"
      },
      {
        "city_name": "Arsikere",
        "id_city": "1531",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Athni",
        "id_city": "1532",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bailhongal",
        "id_city": "1538",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Bannur",
        "id_city": "1545",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Basavakalyan",
        "id_city": "1547",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Belgaum Cantonment",
        "id_city": "1552",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Chitapur",
        "id_city": "1588",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Dargajogihalli",
        "id_city": "1592",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Dod Ballapur",
        "id_city": "1600",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Gundlupet",
        "id_city": "1617",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Hatti",
        "id_city": "1624",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Indi",
        "id_city": "1655",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Jamkhandi",
        "id_city": "1657",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kollegal",
        "id_city": "1679",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Kundgol",
        "id_city": "1700",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Mandya",
        "id_city": "1724",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Ponnampet",
        "id_city": "1768",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sadalgi",
        "id_city": "1778",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sandur",
        "id_city": "1782",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Sidlaghatta",
        "id_city": "1803",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Tekkalakota",
        "id_city": "1819",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Tiptur",
        "id_city": "1823",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Yenagudde",
        "id_city": "1842",
        "state_name": "Karnataka"
      },
      {
        "city_name": "Aluva",
        "id_city": "1849",
        "state_name": "Kerala"
      },
      {
        "city_name": "Azhikode North",
        "id_city": "1856",
        "state_name": "Kerala"
      },
      {
        "city_name": "Azhiyur",
        "id_city": "1858",
        "state_name": "Kerala"
      },
      {
        "city_name": "Cheranallur",
        "id_city": "1873",
        "state_name": "Kerala"
      },
      {
        "city_name": "Cheriyakadavu",
        "id_city": "1874",
        "state_name": "Kerala"
      },
      {
        "city_name": "Cheruthazham",
        "id_city": "1877",
        "state_name": "Kerala"
      },
      {
        "city_name": "Guruvayur",
        "id_city": "1896",
        "state_name": "Kerala"
      },
      {
        "city_name": "Irinjalakuda",
        "id_city": "1901",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kadachira",
        "id_city": "1903",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kadirur",
        "id_city": "1906",
        "state_name": "Kerala"
      },
      {
        "city_name": "Karunagappally",
        "id_city": "1923",
        "state_name": "Kerala"
      },
      {
        "city_name": "Koothattukulam",
        "id_city": "1939",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kumily",
        "id_city": "1951",
        "state_name": "Kerala"
      },
      {
        "city_name": "Maradu",
        "id_city": "1967",
        "state_name": "Kerala"
      },
      {
        "city_name": "Marutharod",
        "id_city": "1969",
        "state_name": "Kerala"
      },
      {
        "city_name": "Munderi",
        "id_city": "1978",
        "state_name": "Kerala"
      },
      {
        "city_name": "Nedumangad",
        "id_city": "1987",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ottappalam",
        "id_city": "1994",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pavaratty",
        "id_city": "2014",
        "state_name": "Kerala"
      },
      {
        "city_name": "Peringathur",
        "id_city": "2019",
        "state_name": "Kerala"
      },
      {
        "city_name": "Shoranur",
        "id_city": "2036",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thiruvananthapuram",
        "id_city": "2045",
        "state_name": "Kerala"
      },
      {
        "city_name": "Alirajpur",
        "id_city": "2075",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badagaon",
        "id_city": "2093",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badod",
        "id_city": "2101",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bagh",
        "id_city": "2104",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Baikunthpur",
        "id_city": "2107",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bamhani",
        "id_city": "2112",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Basoda",
        "id_city": "2126",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bharveli",
        "id_city": "2137",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Budhni",
        "id_city": "2158",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ghansor",
        "id_city": "2205",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Hanumana",
        "id_city": "2215",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jiran",
        "id_city": "2247",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Lakhnadon",
        "id_city": "2289",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mauganj",
        "id_city": "2319",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sagar Cantonment",
        "id_city": "2409",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Talen",
        "id_city": "2454",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ahmednagar",
        "id_city": "2478",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Panur",
        "id_city": "2005",
        "state_name": "Kerala"
      },
      {
        "city_name": "Peermade",
        "id_city": "2016",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thaikkad",
        "id_city": "2040",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thannirmukkam",
        "id_city": "2042",
        "state_name": "Kerala"
      },
      {
        "city_name": "Udma",
        "id_city": "2052",
        "state_name": "Kerala"
      },
      {
        "city_name": "Vaikam",
        "id_city": "2054",
        "state_name": "Kerala"
      },
      {
        "city_name": "Alot",
        "id_city": "2076",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Amla",
        "id_city": "2083",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badra",
        "id_city": "2103",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhikangaon",
        "id_city": "2141",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Deori",
        "id_city": "2180",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Devendranagar",
        "id_city": "2183",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dhar",
        "id_city": "2189",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dungariya Chhapara",
        "id_city": "2196",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Harpalpur",
        "id_city": "2217",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Hindoria",
        "id_city": "2223",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Hirapur",
        "id_city": "2224",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jhabua",
        "id_city": "2245",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khargone",
        "id_city": "2274",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Malhargarh",
        "id_city": "2306",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mandav",
        "id_city": "2309",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Narsingarh",
        "id_city": "2343",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Naudhia",
        "id_city": "2347",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Neuton Chikhli Kalan",
        "id_city": "2352",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Obedullaganj",
        "id_city": "2355",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pandhurna",
        "id_city": "2370",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Parasia",
        "id_city": "2373",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Piploda",
        "id_city": "2383",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Polay Kalan",
        "id_city": "2385",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sehore",
        "id_city": "2421",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shahpur",
        "id_city": "2430",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sonkatch",
        "id_city": "2447",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Suthaliya",
        "id_city": "2452",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Perinthalmanna",
        "id_city": "2020",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pottore",
        "id_city": "2028",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ramanattukara",
        "id_city": "2035",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sulthan Bathery",
        "id_city": "2038",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thrissur",
        "id_city": "2050",
        "state_name": "Kerala"
      },
      {
        "city_name": "Agar",
        "id_city": "2070",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badagoan",
        "id_city": "2094",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badi",
        "id_city": "2097",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhamodi",
        "id_city": "2134",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chachaura Binaganj",
        "id_city": "2161",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jatara",
        "id_city": "2241",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khurai",
        "id_city": "2280",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kukshi",
        "id_city": "2285",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Lidhora Khas",
        "id_city": "2292",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Loharda",
        "id_city": "2294",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Machalpur",
        "id_city": "2295",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Madhogarh",
        "id_city": "2296",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Maihar",
        "id_city": "2300",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Maksi",
        "id_city": "2303",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ordinance Factory Itarsi",
        "id_city": "2358",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rehti",
        "id_city": "2405",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Seoni",
        "id_city": "2425",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shahpura",
        "id_city": "2431",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shajapur",
        "id_city": "2432",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Tal",
        "id_city": "2453",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ukwa",
        "id_city": "2466",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Akalkot",
        "id_city": "2480",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Alore",
        "id_city": "2487",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Aurangabad",
        "id_city": "2499",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pantalam",
        "id_city": "2003",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pathiriyad",
        "id_city": "2011",
        "state_name": "Kerala"
      },
      {
        "city_name": "Perumanna",
        "id_city": "2022",
        "state_name": "Kerala"
      },
      {
        "city_name": "Vayalar",
        "id_city": "2060",
        "state_name": "Kerala"
      },
      {
        "city_name": "Amlai",
        "id_city": "2084",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badoda",
        "id_city": "2102",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bagli",
        "id_city": "2105",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Barigarh",
        "id_city": "2123",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Barwaha",
        "id_city": "2124",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Betma",
        "id_city": "2130",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bijawar",
        "id_city": "2148",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bilpura",
        "id_city": "2153",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Datia",
        "id_city": "2178",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gairatganj",
        "id_city": "2198",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Garoth",
        "id_city": "2203",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kailaras",
        "id_city": "2251",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kakarhati",
        "id_city": "2253",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kothi",
        "id_city": "2283",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mhow",
        "id_city": "2324",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pipliya Mandi",
        "id_city": "2382",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rehli",
        "id_city": "2404",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rewa",
        "id_city": "2406",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sausar",
        "id_city": "2420",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shujalpur",
        "id_city": "2436",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sinhasa",
        "id_city": "2441",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Soyatkalan",
        "id_city": "2448",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Aheri",
        "id_city": "2475",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Alandi",
        "id_city": "2484",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Alibag",
        "id_city": "2485",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ambivali Tarf Wankhal",
        "id_city": "2492",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Aurangabad Cantonment",
        "id_city": "2500",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Puthuppariyaram",
        "id_city": "2033",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thiruvalla",
        "id_city": "2044",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thiruvankulam",
        "id_city": "2046",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thodupuzha",
        "id_city": "2047",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ashoknagar",
        "id_city": "2089",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Banda",
        "id_city": "2115",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bansatar Kheda",
        "id_city": "2117",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bargi",
        "id_city": "2121",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Betul",
        "id_city": "2131",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhedaghat",
        "id_city": "2140",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bilaua",
        "id_city": "2152",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Burhanpur",
        "id_city": "2159",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chhindwara",
        "id_city": "2169",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chitrakut",
        "id_city": "2172",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kareli",
        "id_city": "2258",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kari",
        "id_city": "2260",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Majholi",
        "id_city": "2301",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Meghnagar",
        "id_city": "2320",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Multai",
        "id_city": "2330",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Orachha",
        "id_city": "2357",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pachmarhi Cantonment",
        "id_city": "2360",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Panagar",
        "id_city": "2366",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pansemal",
        "id_city": "2372",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rajnagar",
        "id_city": "2393",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rampur Naikin",
        "id_city": "2396",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ranipura",
        "id_city": "2399",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sohagpur",
        "id_city": "2446",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Unchahara",
        "id_city": "2468",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Unhel",
        "id_city": "2469",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Vehicle Factory Jabalpur",
        "id_city": "2470",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Vidisha",
        "id_city": "2471",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Piravam",
        "id_city": "2026",
        "state_name": "Kerala"
      },
      {
        "city_name": "Sultans Battery",
        "id_city": "2037",
        "state_name": "Kerala"
      },
      {
        "city_name": "Talipparamba",
        "id_city": "2039",
        "state_name": "Kerala"
      },
      {
        "city_name": "Bangawan",
        "id_city": "2116",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhander",
        "id_city": "2135",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhopal",
        "id_city": "2145",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chandia",
        "id_city": "2165",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dumar Kachhar",
        "id_city": "2195",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Govindgarh",
        "id_city": "2211",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Itarsi",
        "id_city": "2231",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jabalpur",
        "id_city": "2232",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kanad",
        "id_city": "2255",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Karnawad",
        "id_city": "2261",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Lahar",
        "id_city": "2288",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Lodhikheda",
        "id_city": "2293",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Manegaon",
        "id_city": "2314",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Manpur",
        "id_city": "2317",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mungaoli",
        "id_city": "2332",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Omkareshwar",
        "id_city": "2356",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Prithvipur",
        "id_city": "2387",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sardarpur",
        "id_city": "2415",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sirmaur",
        "id_city": "2443",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Timarni",
        "id_city": "2462",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Akola",
        "id_city": "2482",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Akot",
        "id_city": "2483",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Perakam",
        "id_city": "2017",
        "state_name": "Kerala"
      },
      {
        "city_name": "Perole",
        "id_city": "2021",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thalassery",
        "id_city": "2041",
        "state_name": "Kerala"
      },
      {
        "city_name": "Varappuzha",
        "id_city": "2058",
        "state_name": "Kerala"
      },
      {
        "city_name": "Agethi",
        "id_city": "2065",
        "state_name": "Lakshadweep"
      },
      {
        "city_name": "Anjad",
        "id_city": "2085",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ashta",
        "id_city": "2090",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Beohari",
        "id_city": "2128",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhanpura",
        "id_city": "2136",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Biaora",
        "id_city": "2147",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bijeypur",
        "id_city": "2149",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Daboh",
        "id_city": "2174",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Damua",
        "id_city": "2177",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Depalpur",
        "id_city": "2182",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dhamnod",
        "id_city": "2186",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dharampuri",
        "id_city": "2190",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gautapura",
        "id_city": "2204",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Hatpipalya",
        "id_city": "2221",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jabalpur G.C.F",
        "id_city": "2234",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jaithari",
        "id_city": "2236",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jaora",
        "id_city": "2239",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jawar",
        "id_city": "2243",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kalichhapar",
        "id_city": "2254",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kantaphod",
        "id_city": "2257",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kasrawad",
        "id_city": "2263",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khujner",
        "id_city": "2279",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kumbhraj",
        "id_city": "2286",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Morena",
        "id_city": "2328",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mundi",
        "id_city": "2331",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nainpur",
        "id_city": "2338",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Namli",
        "id_city": "2340",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Narwar",
        "id_city": "2345",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nepa Nagar",
        "id_city": "2351",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pandhana",
        "id_city": "2369",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Phuph Kalan",
        "id_city": "2379",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Singolo",
        "id_city": "2439",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Singrauli",
        "id_city": "2440",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Tendukheda",
        "id_city": "2458",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Thandia",
        "id_city": "2460",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Allapalli",
        "id_city": "2486",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Thottada",
        "id_city": "2048",
        "state_name": "Kerala"
      },
      {
        "city_name": "Amanganj",
        "id_city": "2077",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Amarkantak",
        "id_city": "2078",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Antri",
        "id_city": "2086",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badnawar",
        "id_city": "2100",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dighawani",
        "id_city": "2191",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dola",
        "id_city": "2194",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jaisinghnagar",
        "id_city": "2235",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jirapur",
        "id_city": "2248",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jobat",
        "id_city": "2249",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kaimur",
        "id_city": "2252",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Karera",
        "id_city": "2259",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khaniyadhana",
        "id_city": "2272",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khetia",
        "id_city": "2276",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kolaras",
        "id_city": "2281",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Makronia",
        "id_city": "2302",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nasrullaganj",
        "id_city": "2346",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pali",
        "id_city": "2365",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pasan",
        "id_city": "2374",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pichhore",
        "id_city": "2380",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Porsa",
        "id_city": "2386",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rahatgarh",
        "id_city": "2389",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ratlam",
        "id_city": "2401",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Satai",
        "id_city": "2417",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Seondha",
        "id_city": "2424",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Tarana",
        "id_city": "2455",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ahmadpur",
        "id_city": "2477",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ajra",
        "id_city": "2479",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pathanamthitta",
        "id_city": "2009",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pattambi",
        "id_city": "2012",
        "state_name": "Kerala"
      },
      {
        "city_name": "Perumbaikadu",
        "id_city": "2023",
        "state_name": "Kerala"
      },
      {
        "city_name": "Puthunagaram",
        "id_city": "2032",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ajaigarh",
        "id_city": "2071",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ambada",
        "id_city": "2081",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Barela",
        "id_city": "2119",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Barhi",
        "id_city": "2122",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhavra",
        "id_city": "2139",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bijrauni",
        "id_city": "2150",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Birsinghpur",
        "id_city": "2156",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chhota Chhindwara",
        "id_city": "2170",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Deori Khas",
        "id_city": "2181",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Diken",
        "id_city": "2192",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gandhi Sagar Hydel Colony",
        "id_city": "2199",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Garhi Malhara",
        "id_city": "2202",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Guna",
        "id_city": "2212",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Harrai",
        "id_city": "2218",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Hatod",
        "id_city": "2220",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Isagarh",
        "id_city": "2230",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jawad",
        "id_city": "2242",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Joura",
        "id_city": "2250",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Lateri",
        "id_city": "2290",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Malaj Khand",
        "id_city": "2304",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mandideep",
        "id_city": "2310",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mandleshwar",
        "id_city": "2312",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Manglaya Sadak",
        "id_city": "2316",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mhaugaon",
        "id_city": "2323",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mihona",
        "id_city": "2325",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Palera",
        "id_city": "2364",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Raisen",
        "id_city": "2390",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rajgarh",
        "id_city": "2392",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ratangarh",
        "id_city": "2400",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shivpuri",
        "id_city": "2435",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Udaipura",
        "id_city": "2464",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Umaria",
        "id_city": "2467",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Waraseoni",
        "id_city": "2473",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Amravati",
        "id_city": "2494",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Parassala",
        "id_city": "2007",
        "state_name": "Kerala"
      },
      {
        "city_name": "Puzhathi",
        "id_city": "2034",
        "state_name": "Kerala"
      },
      {
        "city_name": "Tirur",
        "id_city": "2051",
        "state_name": "Kerala"
      },
      {
        "city_name": "Vadakara",
        "id_city": "2053",
        "state_name": "Kerala"
      },
      {
        "city_name": "Villiappally",
        "id_city": "2063",
        "state_name": "Kerala"
      },
      {
        "city_name": "Wayanad",
        "id_city": "2064",
        "state_name": "Kerala"
      },
      {
        "city_name": "Kavaratti",
        "id_city": "2068",
        "state_name": "Lakshadweep"
      },
      {
        "city_name": "Baldeogarh",
        "id_city": "2110",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chandla",
        "id_city": "2166",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dabra",
        "id_city": "2175",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Devhara",
        "id_city": "2184",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Hatta",
        "id_city": "2222",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jamai",
        "id_city": "2238",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Katangi",
        "id_city": "2264",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khirkiya",
        "id_city": "2278",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Maheshwar",
        "id_city": "2298",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Morar",
        "id_city": "2327",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Morwa",
        "id_city": "2329",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nagri",
        "id_city": "2336",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Panara",
        "id_city": "2367",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rajakhedi",
        "id_city": "2391",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rajpur",
        "id_city": "2394",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rampura",
        "id_city": "2397",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ratlam Kasba",
        "id_city": "2402",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sendhwa",
        "id_city": "2423",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sitamau",
        "id_city": "2445",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sultanpur",
        "id_city": "2450",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ujjain",
        "id_city": "2465",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Paluvai",
        "id_city": "2001",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pudukad",
        "id_city": "2029",
        "state_name": "Kerala"
      },
      {
        "city_name": "Punalur",
        "id_city": "2030",
        "state_name": "Kerala"
      },
      {
        "city_name": "Puranattukara",
        "id_city": "2031",
        "state_name": "Kerala"
      },
      {
        "city_name": "Anuppur",
        "id_city": "2087",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Balaghat",
        "id_city": "2109",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bamaniya",
        "id_city": "2111",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bamor",
        "id_city": "2113",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bamora",
        "id_city": "2114",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Berasia",
        "id_city": "2129",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhitarwar",
        "id_city": "2144",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chandameta Butar",
        "id_city": "2163",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chaurai Khas",
        "id_city": "2167",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Damoh",
        "id_city": "2176",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Deodara",
        "id_city": "2179",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dewas",
        "id_city": "2185",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dhana",
        "id_city": "2187",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gogaon",
        "id_city": "2207",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Katni",
        "id_city": "2265",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khand",
        "id_city": "2270",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kotar",
        "id_city": "2282",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kurwai",
        "id_city": "2287",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mangawan",
        "id_city": "2315",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mau",
        "id_city": "2318",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nagod",
        "id_city": "2335",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Naugaon",
        "id_city": "2348",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Naurozabad",
        "id_city": "2349",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sabalgarh",
        "id_city": "2407",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sarni",
        "id_city": "2416",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Seoni Malwa",
        "id_city": "2426",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Tirodi",
        "id_city": "2463",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Vijayraghavgarh",
        "id_city": "2472",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ambad",
        "id_city": "2489",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ambajogai",
        "id_city": "2490",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Payyannur",
        "id_city": "2015",
        "state_name": "Kerala"
      },
      {
        "city_name": "Ponnani",
        "id_city": "2027",
        "state_name": "Kerala"
      },
      {
        "city_name": "Varam",
        "id_city": "2057",
        "state_name": "Kerala"
      },
      {
        "city_name": "Akodia",
        "id_city": "2073",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Alampur",
        "id_city": "2074",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badnagar",
        "id_city": "2099",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Begamganj",
        "id_city": "2127",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Betul Bazar",
        "id_city": "2132",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhuibandh",
        "id_city": "2146",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bina-Etawa",
        "id_city": "2155",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dindori",
        "id_city": "2193",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gogapur",
        "id_city": "2208",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gohad",
        "id_city": "2209",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Harda",
        "id_city": "2216",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Iklehra",
        "id_city": "2227",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jhundpura",
        "id_city": "2246",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kannod",
        "id_city": "2256",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khandwa",
        "id_city": "2271",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khategaon",
        "id_city": "2275",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kotma",
        "id_city": "2284",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Narsimhapur",
        "id_city": "2342",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rampur Baghelan",
        "id_city": "2395",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sailana",
        "id_city": "2410",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sanwer",
        "id_city": "2413",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Satna",
        "id_city": "2418",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Satwas",
        "id_city": "2419",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shahgarh",
        "id_city": "2429",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shamgarh",
        "id_city": "2433",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sidhi",
        "id_city": "2437",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sironj",
        "id_city": "2444",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Susner",
        "id_city": "2451",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Tekanpur",
        "id_city": "2457",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Akkalkuwa",
        "id_city": "2481",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ambernath",
        "id_city": "2491",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Panthiramkavu",
        "id_city": "2004",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pinarayi",
        "id_city": "2025",
        "state_name": "Kerala"
      },
      {
        "city_name": "Theyyalingal",
        "id_city": "2043",
        "state_name": "Kerala"
      },
      {
        "city_name": "Varkala",
        "id_city": "2059",
        "state_name": "Kerala"
      },
      {
        "city_name": "Amini",
        "id_city": "2066",
        "state_name": "Lakshadweep"
      },
      {
        "city_name": "Amarpatan",
        "id_city": "2079",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badawada",
        "id_city": "2096",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhind",
        "id_city": "2143",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bijuri",
        "id_city": "2151",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Garhakota",
        "id_city": "2201",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jabalpur Cantonment",
        "id_city": "2233",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Manawar",
        "id_city": "2308",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mohgaon",
        "id_city": "2326",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Naigarhi",
        "id_city": "2337",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Narayangarh",
        "id_city": "2341",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Neemuch",
        "id_city": "2350",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nimach",
        "id_city": "2353",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Palda",
        "id_city": "2363",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pandaria",
        "id_city": "2368",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ranapur",
        "id_city": "2398",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Semaria",
        "id_city": "2422",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sethia",
        "id_city": "2427",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Shahdol",
        "id_city": "2428",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sheopur",
        "id_city": "2434",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sihora",
        "id_city": "2438",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Suhagi",
        "id_city": "2449",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Taricharkalan",
        "id_city": "2456",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Panniyannur",
        "id_city": "2002",
        "state_name": "Kerala"
      },
      {
        "city_name": "Paravur",
        "id_city": "2008",
        "state_name": "Kerala"
      },
      {
        "city_name": "Pattiom",
        "id_city": "2013",
        "state_name": "Kerala"
      },
      {
        "city_name": "Valapattam",
        "id_city": "2055",
        "state_name": "Kerala"
      },
      {
        "city_name": "Vazhakkala",
        "id_city": "2061",
        "state_name": "Kerala"
      },
      {
        "city_name": "Babai",
        "id_city": "2091",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Barghat",
        "id_city": "2120",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Barwani",
        "id_city": "2125",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhilakhedi",
        "id_city": "2142",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chhatarpur",
        "id_city": "2168",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Dhanpuri",
        "id_city": "2188",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gadarwara",
        "id_city": "2197",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ganjbasoda",
        "id_city": "2200",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Indore",
        "id_city": "2229",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jatachhapar",
        "id_city": "2240",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khargapur",
        "id_city": "2273",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Laundi",
        "id_city": "2291",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Manasa",
        "id_city": "2307",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Narsinghpur",
        "id_city": "2344",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pachmarhi",
        "id_city": "2359",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Palchorai",
        "id_city": "2362",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Petlawad",
        "id_city": "2378",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Raghogarh",
        "id_city": "2388",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sagar",
        "id_city": "2408",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Tikamgarh",
        "id_city": "2461",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Achalpur",
        "id_city": "2474",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ahmadnagar Cantonment",
        "id_city": "2476",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Arvi",
        "id_city": "2496",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pathanapuram",
        "id_city": "2010",
        "state_name": "Kerala"
      },
      {
        "city_name": "Peralasseri",
        "id_city": "2018",
        "state_name": "Kerala"
      },
      {
        "city_name": "Perumbavoor",
        "id_city": "2024",
        "state_name": "Kerala"
      },
      {
        "city_name": "Thrippunithura",
        "id_city": "2049",
        "state_name": "Kerala"
      },
      {
        "city_name": "Androth Island",
        "id_city": "2067",
        "state_name": "Lakshadweep"
      },
      {
        "city_name": "Akoda",
        "id_city": "2072",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bada Malhera",
        "id_city": "2092",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badarwas",
        "id_city": "2095",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Badkuhi",
        "id_city": "2098",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Baihar",
        "id_city": "2106",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bakswaha",
        "id_city": "2108",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhainsdehi",
        "id_city": "2133",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bhaurasa",
        "id_city": "2138",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Boda",
        "id_city": "2157",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Burhar",
        "id_city": "2160",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chanderi",
        "id_city": "2164",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Churhat",
        "id_city": "2173",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ghuwara",
        "id_city": "2206",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gurh",
        "id_city": "2213",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Hoshangabad",
        "id_city": "2225",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ichhawar",
        "id_city": "2226",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jeronkhalsa",
        "id_city": "2244",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Kelhauri",
        "id_city": "2266",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khamaria",
        "id_city": "2269",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khilchipur",
        "id_city": "2277",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Maharajpur",
        "id_city": "2297",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mahidpur",
        "id_city": "2299",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Malanpur",
        "id_city": "2305",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mandsaur",
        "id_city": "2313",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mehara Gaon",
        "id_city": "2321",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mehgaon",
        "id_city": "2322",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nagda",
        "id_city": "2334",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Niwari",
        "id_city": "2354",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pachore",
        "id_city": "2361",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pawai",
        "id_city": "2377",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Rau",
        "id_city": "2403",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sanawad",
        "id_city": "2411",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sanchi",
        "id_city": "2412",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sirgora",
        "id_city": "2442",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Amgaon",
        "id_city": "2493",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ashti",
        "id_city": "2498",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pappinisseri",
        "id_city": "2006",
        "state_name": "Kerala"
      },
      {
        "city_name": "Vallachira",
        "id_city": "2056",
        "state_name": "Kerala"
      },
      {
        "city_name": "Venmanad",
        "id_city": "2062",
        "state_name": "Kerala"
      },
      {
        "city_name": "Minicoy",
        "id_city": "2069",
        "state_name": "Lakshadweep"
      },
      {
        "city_name": "Amarwara",
        "id_city": "2080",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Ambah",
        "id_city": "2082",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Aron",
        "id_city": "2088",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Baraily",
        "id_city": "2118",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Bina Railway Colony",
        "id_city": "2154",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chakghat",
        "id_city": "2162",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Chichli",
        "id_city": "2171",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gormi",
        "id_city": "2210",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Gwalior",
        "id_city": "2214",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Harsud",
        "id_city": "2219",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Indergarh",
        "id_city": "2228",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Jaitwara",
        "id_city": "2237",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Karrapur",
        "id_city": "2262",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khachrod",
        "id_city": "2267",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Khajuraho",
        "id_city": "2268",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Mandla",
        "id_city": "2311",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Murwara",
        "id_city": "2333",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Nalkheda",
        "id_city": "2339",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Panna",
        "id_city": "2371",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Patan",
        "id_city": "2375",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Patharia",
        "id_city": "2376",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pipariya",
        "id_city": "2381",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Pithampur",
        "id_city": "2384",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Sarangpur",
        "id_city": "2414",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Teonthar",
        "id_city": "2459",
        "state_name": "Madhya Pradesh"
      },
      {
        "city_name": "Amalner",
        "id_city": "2488",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Anjangaon",
        "id_city": "2495",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ashta",
        "id_city": "2497",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bhadravati",
        "id_city": "2510",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Gangapur",
        "id_city": "2585",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kagal",
        "id_city": "2612",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kalas",
        "id_city": "2615",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kandri",
        "id_city": "2623",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kopargaon",
        "id_city": "2655",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Lonar",
        "id_city": "2671",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mapuca",
        "id_city": "2691",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Naldurg",
        "id_city": "2718",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Panchgani",
        "id_city": "2741",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Parbhani",
        "id_city": "2747",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Raigad",
        "id_city": "2771",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Revadanda",
        "id_city": "2780",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Savda",
        "id_city": "2793",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sindhudurg",
        "id_city": "2813",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sindkhed Raja",
        "id_city": "2816",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sonai",
        "id_city": "2822",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Srivardhan",
        "id_city": "2825",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ulhasnagar",
        "id_city": "2844",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jiribam",
        "id_city": "2890",
        "state_name": "Manipur"
      },
      {
        "city_name": "Khongman",
        "id_city": "2893",
        "state_name": "Manipur"
      },
      {
        "city_name": "Mayang Imphal",
        "id_city": "2900",
        "state_name": "Manipur"
      },
      {
        "city_name": "Jawai",
        "id_city": "2921",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Pynthorumkhrah",
        "id_city": "2929",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Khawzawl",
        "id_city": "2943",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Serchhip",
        "id_city": "2952",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Vairengte",
        "id_city": "2955",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Barpali",
        "id_city": "2984",
        "state_name": "Odisha"
      },
      {
        "city_name": "Baudh",
        "id_city": "2986",
        "state_name": "Odisha"
      },
      {
        "city_name": "Balapur",
        "id_city": "2504",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Buldana",
        "id_city": "2528",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chikhaldara",
        "id_city": "2539",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Daharu",
        "id_city": "2548",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dombivli",
        "id_city": "2571",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Edandol",
        "id_city": "2576",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Hadgaon",
        "id_city": "2594",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kalundre",
        "id_city": "2617",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Karjat",
        "id_city": "2632",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kasara Budruk",
        "id_city": "2634",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khadki",
        "id_city": "2640",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kharakvasla",
        "id_city": "2644",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Koregaon",
        "id_city": "2658",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Korochi",
        "id_city": "2659",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mahadula",
        "id_city": "2676",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Manmad",
        "id_city": "2687",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Manor",
        "id_city": "2688",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mulshi",
        "id_city": "2706",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mumbai",
        "id_city": "2707",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nashik",
        "id_city": "2724",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Padagha",
        "id_city": "2737",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Paithan",
        "id_city": "2738",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Savner",
        "id_city": "2794",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shegaon",
        "id_city": "2799",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shirdi",
        "id_city": "2802",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Trimbak",
        "id_city": "2839",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vashind",
        "id_city": "2862",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Yavatmal",
        "id_city": "2881",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sekmai Bazar",
        "id_city": "2909",
        "state_name": "Manipur"
      },
      {
        "city_name": "Thoubal",
        "id_city": "2914",
        "state_name": "Manipur"
      },
      {
        "city_name": "Wangjing",
        "id_city": "2916",
        "state_name": "Manipur"
      },
      {
        "city_name": "Belpahar",
        "id_city": "2989",
        "state_name": "Odisha"
      },
      {
        "city_name": "Chandili",
        "id_city": "3008",
        "state_name": "Odisha"
      },
      {
        "city_name": "Beed",
        "id_city": "2509",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Budhgaon",
        "id_city": "2527",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chikhala",
        "id_city": "2538",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dewhadi",
        "id_city": "2562",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Digras",
        "id_city": "2570",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dudhani",
        "id_city": "2573",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Durgapur",
        "id_city": "2574",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Eklahare",
        "id_city": "2577",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ghoti",
        "id_city": "2588",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kalmeshwar",
        "id_city": "2616",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kandri II",
        "id_city": "2624",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kankavli",
        "id_city": "2626",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Katai",
        "id_city": "2635",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kegaon",
        "id_city": "2638",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kolhapur",
        "id_city": "2652",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Lohegaon",
        "id_city": "2670",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mahabaleshwar",
        "id_city": "2674",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mohpada",
        "id_city": "2699",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nagothane",
        "id_city": "2714",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Panhala",
        "id_city": "2744",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Patur",
        "id_city": "2755",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pethumri",
        "id_city": "2758",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pulgaon",
        "id_city": "2762",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sakri",
        "id_city": "2783",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sandor",
        "id_city": "2784",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sillod",
        "id_city": "2812",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Solapur",
        "id_city": "2821",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Tathavade",
        "id_city": "2833",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Umarkhed",
        "id_city": "2846",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bishnupur",
        "id_city": "2886",
        "state_name": "Manipur"
      },
      {
        "city_name": "Kakching",
        "id_city": "2891",
        "state_name": "Manipur"
      },
      {
        "city_name": "Torban",
        "id_city": "2915",
        "state_name": "Manipur"
      },
      {
        "city_name": "Mairang",
        "id_city": "2923",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Nongstoin",
        "id_city": "2927",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Resubelpara",
        "id_city": "2930",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Shillong",
        "id_city": "2931",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Barbil",
        "id_city": "2981",
        "state_name": "Odisha"
      },
      {
        "city_name": "Chandapur",
        "id_city": "3006",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bid",
        "id_city": "2521",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bop Khel",
        "id_city": "2525",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chinchwad",
        "id_city": "2542",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Davlameti",
        "id_city": "2554",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dondaicha",
        "id_city": "2572",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ghatanji",
        "id_city": "2587",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khoni",
        "id_city": "2647",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khuldabad",
        "id_city": "2649",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kinwat",
        "id_city": "2650",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kundalwadi",
        "id_city": "2662",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Miraj",
        "id_city": "2697",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mowad",
        "id_city": "2702",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Murbad",
        "id_city": "2708",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Navi Mumbai Panvel",
        "id_city": "2727",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nildoh",
        "id_city": "2731",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Patan",
        "id_city": "2752",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pune Cantonment",
        "id_city": "2764",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shahada",
        "id_city": "2797",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shendurjana",
        "id_city": "2801",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sindi",
        "id_city": "2814",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vasai",
        "id_city": "2860",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vengurla",
        "id_city": "2863",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Washim",
        "id_city": "2879",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Lamjaotongba",
        "id_city": "2897",
        "state_name": "Manipur"
      },
      {
        "city_name": "Moreh",
        "id_city": "2902",
        "state_name": "Manipur"
      },
      {
        "city_name": "Tlabung",
        "id_city": "2954",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Kohima",
        "id_city": "2959",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Aska",
        "id_city": "2968",
        "state_name": "Odisha"
      },
      {
        "city_name": "Balagoda",
        "id_city": "2971",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhawanipatna",
        "id_city": "2993",
        "state_name": "Odisha"
      },
      {
        "city_name": "Chikitigarh",
        "id_city": "3011",
        "state_name": "Odisha"
      },
      {
        "city_name": "Barshi",
        "id_city": "2507",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chakan",
        "id_city": "2531",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dattapur",
        "id_city": "2552",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Deoli",
        "id_city": "2559",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dyane",
        "id_city": "2575",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Fekari",
        "id_city": "2579",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ichalkaranji",
        "id_city": "2599",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jamkhed",
        "id_city": "2605",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jintur",
        "id_city": "2609",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kalyan",
        "id_city": "2618",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Karad",
        "id_city": "2628",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Katol",
        "id_city": "2637",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khamgaon",
        "id_city": "2641",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kherdi",
        "id_city": "2646",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kon",
        "id_city": "2653",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Manchar",
        "id_city": "2684",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mudkhed",
        "id_city": "2703",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nagpur",
        "id_city": "2715",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nilanga",
        "id_city": "2730",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pali",
        "id_city": "2740",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pasthal",
        "id_city": "2751",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Raver",
        "id_city": "2779",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sangole",
        "id_city": "2787",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sasti",
        "id_city": "2788",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Andro",
        "id_city": "2884",
        "state_name": "Manipur"
      },
      {
        "city_name": "Lamshang",
        "id_city": "2898",
        "state_name": "Manipur"
      },
      {
        "city_name": "Darlawn",
        "id_city": "2939",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Mokokchung",
        "id_city": "2960",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Balangir",
        "id_city": "2972",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bangura",
        "id_city": "2978",
        "state_name": "Odisha"
      },
      {
        "city_name": "Banki",
        "id_city": "2979",
        "state_name": "Odisha"
      },
      {
        "city_name": "Belagachhia",
        "id_city": "2987",
        "state_name": "Odisha"
      },
      {
        "city_name": "Berhampur",
        "id_city": "2990",
        "state_name": "Odisha"
      },
      {
        "city_name": "Chatrapur",
        "id_city": "3010",
        "state_name": "Odisha"
      },
      {
        "city_name": "Babhulgaon",
        "id_city": "2502",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Basmat",
        "id_city": "2508",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chikhli",
        "id_city": "2540",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chiplun",
        "id_city": "2543",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Deolali",
        "id_city": "2557",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Gadchiroli",
        "id_city": "2580",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jalna",
        "id_city": "2604",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kamthi",
        "id_city": "2619",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kopharad",
        "id_city": "2656",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Koradi",
        "id_city": "2657",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Madhavnagar",
        "id_city": "2673",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mangrul Pir",
        "id_city": "2686",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mhasla",
        "id_city": "2694",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mohpa",
        "id_city": "2698",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nigdi",
        "id_city": "2729",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pune",
        "id_city": "2763",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shelar",
        "id_city": "2800",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shirur",
        "id_city": "2805",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Talegaon Dabhade",
        "id_city": "2827",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Tekadi",
        "id_city": "2834",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Totaladoh",
        "id_city": "2838",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Udgir",
        "id_city": "2843",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Varangaon",
        "id_city": "2859",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Yaval",
        "id_city": "2880",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kakching Khunou",
        "id_city": "2892",
        "state_name": "Manipur"
      },
      {
        "city_name": "Lamai",
        "id_city": "2896",
        "state_name": "Manipur"
      },
      {
        "city_name": "Nambol",
        "id_city": "2903",
        "state_name": "Manipur"
      },
      {
        "city_name": "Baghmara",
        "id_city": "2919",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Cherrapunji",
        "id_city": "2920",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Sairang",
        "id_city": "2950",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Ballarpur",
        "id_city": "2505",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bhor",
        "id_city": "2517",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Birwadi",
        "id_city": "2523",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chalisgaon",
        "id_city": "2532",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dehu Road",
        "id_city": "2556",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dhule",
        "id_city": "2567",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Karmala",
        "id_city": "2633",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kusgaon Budruk",
        "id_city": "2665",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mansar",
        "id_city": "2689",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Moram",
        "id_city": "2700",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Neral",
        "id_city": "2728",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pachora",
        "id_city": "2736",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pathardi",
        "id_city": "2753",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Purna",
        "id_city": "2765",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Satana",
        "id_city": "2790",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Soyagaon",
        "id_city": "2824",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Samurou",
        "id_city": "2908",
        "state_name": "Manipur"
      },
      {
        "city_name": "Shillong Cantonment",
        "id_city": "2932",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Thenzawl",
        "id_city": "2953",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Dimapur",
        "id_city": "2958",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Wokha",
        "id_city": "2964",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Athmallik",
        "id_city": "2970",
        "state_name": "Odisha"
      },
      {
        "city_name": "Banapur",
        "id_city": "2977",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhuban",
        "id_city": "2994",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhandara",
        "id_city": "2512",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Biloli",
        "id_city": "2522",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Gandhi Nagar",
        "id_city": "2582",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Igatpuri",
        "id_city": "2600",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jejuri",
        "id_city": "2608",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khadkale",
        "id_city": "2639",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kharadi",
        "id_city": "2643",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khopoli",
        "id_city": "2648",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kurduvadi",
        "id_city": "2664",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Malegaon",
        "id_city": "2679",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Matheran",
        "id_city": "2692",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mehkar",
        "id_city": "2693",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mira Bhayandar",
        "id_city": "2696",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Morshi",
        "id_city": "2701",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mukhed",
        "id_city": "2704",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nanded",
        "id_city": "2719",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ojhar",
        "id_city": "2733",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Paranda",
        "id_city": "2746",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pathri",
        "id_city": "2754",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Rajgurunagar",
        "id_city": "2773",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Tirira",
        "id_city": "2837",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Tuljapur",
        "id_city": "2840",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Umarsara",
        "id_city": "2847",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vaijapur",
        "id_city": "2857",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vasantnagar",
        "id_city": "2861",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Churachandpur",
        "id_city": "2887",
        "state_name": "Manipur"
      },
      {
        "city_name": "Imphal",
        "id_city": "2889",
        "state_name": "Manipur"
      },
      {
        "city_name": "Kumbi",
        "id_city": "2894",
        "state_name": "Manipur"
      },
      {
        "city_name": "Nongthymmai",
        "id_city": "2928",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Biate",
        "id_city": "2937",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Kawnpui",
        "id_city": "2941",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Khawhai",
        "id_city": "2942",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Saiha",
        "id_city": "2949",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Balasore",
        "id_city": "2973",
        "state_name": "Odisha"
      },
      {
        "city_name": "Banposh",
        "id_city": "2980",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bargarh",
        "id_city": "2982",
        "state_name": "Odisha"
      },
      {
        "city_name": "Champua",
        "id_city": "3005",
        "state_name": "Odisha"
      },
      {
        "city_name": "Chandbali",
        "id_city": "3007",
        "state_name": "Odisha"
      },
      {
        "city_name": "Badlapur",
        "id_city": "2503",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dharmabad",
        "id_city": "2564",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Gevrai",
        "id_city": "2586",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ghugus",
        "id_city": "2589",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ghulewadi",
        "id_city": "2590",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Godoli",
        "id_city": "2591",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Harnai Beach",
        "id_city": "2595",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Indapur",
        "id_city": "2601",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kannad",
        "id_city": "2627",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khed",
        "id_city": "2645",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Majalgaon",
        "id_city": "2678",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Manadur",
        "id_city": "2683",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nagardeole",
        "id_city": "2713",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Partur",
        "id_city": "2750",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Phaltan",
        "id_city": "2759",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pimpri",
        "id_city": "2760",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Purushottamnagar",
        "id_city": "2766",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Rajur",
        "id_city": "2774",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Rajura",
        "id_city": "2775",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shahapur",
        "id_city": "2798",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sinnar",
        "id_city": "2818",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sitasawangi",
        "id_city": "2820",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Uchgaon",
        "id_city": "2842",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vadgaon",
        "id_city": "2855",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Virar",
        "id_city": "2864",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Heriok",
        "id_city": "2888",
        "state_name": "Manipur"
      },
      {
        "city_name": "Nongmynsong",
        "id_city": "2925",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Nongpoh",
        "id_city": "2926",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "North Vanlaiphai",
        "id_city": "2948",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Mon",
        "id_city": "2961",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Phek",
        "id_city": "2962",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Anandapur",
        "id_city": "2966",
        "state_name": "Odisha"
      },
      {
        "city_name": "Ausa",
        "id_city": "2501",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Baramati",
        "id_city": "2506",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bhigvan",
        "id_city": "2513",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bhiwandi",
        "id_city": "2515",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chandvad",
        "id_city": "2536",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Desaiganj",
        "id_city": "2560",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Faizpur",
        "id_city": "2578",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Hinganghat",
        "id_city": "2596",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Hingoli",
        "id_city": "2597",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kalamb",
        "id_city": "2613",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Karanja",
        "id_city": "2629",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Lanja",
        "id_city": "2666",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Malkapur",
        "id_city": "2681",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nachane",
        "id_city": "2712",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pawni",
        "id_city": "2756",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pusad",
        "id_city": "2767",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Savantvadi",
        "id_city": "2792",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sawari Jawharnagar",
        "id_city": "2795",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Singnapur",
        "id_city": "2817",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sirur",
        "id_city": "2819",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Taloda",
        "id_city": "2828",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Taloja",
        "id_city": "2829",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Talwade",
        "id_city": "2830",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Utekhol",
        "id_city": "2853",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vanvadi",
        "id_city": "2858",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sikhong Sekmai",
        "id_city": "2911",
        "state_name": "Manipur"
      },
      {
        "city_name": "Baleshwar",
        "id_city": "2974",
        "state_name": "Odisha"
      },
      {
        "city_name": "Balimeta",
        "id_city": "2975",
        "state_name": "Odisha"
      },
      {
        "city_name": "Belaguntha",
        "id_city": "2988",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhadrak",
        "id_city": "2991",
        "state_name": "Odisha"
      },
      {
        "city_name": "Burla",
        "id_city": "3003",
        "state_name": "Odisha"
      },
      {
        "city_name": "Choudwar",
        "id_city": "3013",
        "state_name": "Odisha"
      },
      {
        "city_name": "Buldhana",
        "id_city": "2529",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Butibori",
        "id_city": "2530",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chandur",
        "id_city": "2534",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chinchani",
        "id_city": "2541",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Deulgaon Raja",
        "id_city": "2561",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dhatau",
        "id_city": "2566",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Gadhinghaj",
        "id_city": "2581",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kabnur",
        "id_city": "2611",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kamthi Cantonment",
        "id_city": "2620",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Karivali",
        "id_city": "2631",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Khapa",
        "id_city": "2642",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kondumal",
        "id_city": "2654",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Malwan",
        "id_city": "2682",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mhaswad",
        "id_city": "2695",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Murgud",
        "id_city": "2709",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nandura",
        "id_city": "2721",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nandurbar",
        "id_city": "2722",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Osmanabad",
        "id_city": "2734",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pachgaon",
        "id_city": "2735",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Panvel",
        "id_city": "2745",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Parola",
        "id_city": "2749",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pen",
        "id_city": "2757",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Poladpur",
        "id_city": "2761",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Rajapur",
        "id_city": "2772",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ratnagiri",
        "id_city": "2777",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Risod",
        "id_city": "2781",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Satara",
        "id_city": "2791",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shivatkar",
        "id_city": "2807",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Champhai",
        "id_city": "2938",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Athgarh",
        "id_city": "2969",
        "state_name": "Odisha"
      },
      {
        "city_name": "Basudebpur",
        "id_city": "2985",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhanjanagar",
        "id_city": "2992",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhubaneswar",
        "id_city": "2995",
        "state_name": "Odisha"
      },
      {
        "city_name": "Birmitrapur",
        "id_city": "2997",
        "state_name": "Odisha"
      },
      {
        "city_name": "Brajrajnagar",
        "id_city": "3001",
        "state_name": "Odisha"
      },
      {
        "city_name": "Charibatia",
        "id_city": "3009",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhosari",
        "id_city": "2518",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Boisar",
        "id_city": "2524",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dapoli Camp",
        "id_city": "2549",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Darwa",
        "id_city": "2550",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Daund",
        "id_city": "2553",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Deglur",
        "id_city": "2555",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Hupari",
        "id_city": "2598",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jawhar",
        "id_city": "2606",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kurandvad",
        "id_city": "2663",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Loha",
        "id_city": "2669",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Maindargi",
        "id_city": "2677",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Navapur",
        "id_city": "2725",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Navi Mumbai",
        "id_city": "2726",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nimbhore",
        "id_city": "2732",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pandhakarwada",
        "id_city": "2742",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Parli",
        "id_city": "2748",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Rahuri",
        "id_city": "2770",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ramtek",
        "id_city": "2776",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ravalgaon",
        "id_city": "2778",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sangamner",
        "id_city": "2785",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sonegaon",
        "id_city": "2823",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Surgana",
        "id_city": "2826",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Tarapur",
        "id_city": "2831",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Tasgaon",
        "id_city": "2832",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Uran",
        "id_city": "2851",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ningthoukhong",
        "id_city": "2905",
        "state_name": "Manipur"
      },
      {
        "city_name": "Senapati",
        "id_city": "2910",
        "state_name": "Manipur"
      },
      {
        "city_name": "Thongkhong Laxmi Bazar",
        "id_city": "2913",
        "state_name": "Manipur"
      },
      {
        "city_name": "Madanrting",
        "id_city": "2922",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Lengpui",
        "id_city": "2945",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Bishama Katek",
        "id_city": "2998",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bolangir",
        "id_city": "2999",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhusawal",
        "id_city": "2520",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Deolali Pravara",
        "id_city": "2558",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Diglur",
        "id_city": "2569",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kanhan",
        "id_city": "2625",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Karanje Tarf",
        "id_city": "2630",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Katkar",
        "id_city": "2636",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kodoli",
        "id_city": "2651",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kundaim",
        "id_city": "2661",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Lasalgaon",
        "id_city": "2667",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Malgaon",
        "id_city": "2680",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Manwath",
        "id_city": "2690",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mul",
        "id_city": "2705",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Murtijapur",
        "id_city": "2710",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nalasopara",
        "id_city": "2717",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nandgaon",
        "id_city": "2720",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Narkhed",
        "id_city": "2723",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Pandharpur",
        "id_city": "2743",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Rahta Pimplas",
        "id_city": "2769",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sangli",
        "id_city": "2786",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shirwal",
        "id_city": "2806",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Telhara",
        "id_city": "2835",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Umri Pragane Balapur",
        "id_city": "2850",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kwakta",
        "id_city": "2895",
        "state_name": "Manipur"
      },
      {
        "city_name": "Moirang",
        "id_city": "2901",
        "state_name": "Manipur"
      },
      {
        "city_name": "Naoriya Pakhanglakpa",
        "id_city": "2904",
        "state_name": "Manipur"
      },
      {
        "city_name": "Oinam",
        "id_city": "2906",
        "state_name": "Manipur"
      },
      {
        "city_name": "Sugnu",
        "id_city": "2912",
        "state_name": "Manipur"
      },
      {
        "city_name": "Hnahthial",
        "id_city": "2940",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Zawlnuam",
        "id_city": "2956",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Zunheboto",
        "id_city": "2965",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Buguda",
        "id_city": "3002",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhagur",
        "id_city": "2511",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chandur Bazar",
        "id_city": "2535",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chicholi",
        "id_city": "2537",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chopda",
        "id_city": "2544",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dahance",
        "id_city": "2546",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dahanu",
        "id_city": "2547",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dharangaon",
        "id_city": "2563",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dharur",
        "id_city": "2565",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Gondia",
        "id_city": "2592",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Guhagar",
        "id_city": "2593",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jalgaon",
        "id_city": "2603",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Junnar",
        "id_city": "2610",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kandari",
        "id_city": "2621",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kandhar",
        "id_city": "2622",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Nakoda",
        "id_city": "2716",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Palghar",
        "id_city": "2739",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Rahimatpur",
        "id_city": "2768",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Roha Ashtami",
        "id_city": "2782",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sasvad",
        "id_city": "2789",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Selu",
        "id_city": "2796",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shrigonda",
        "id_city": "2808",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sindi Turf Hindnagar",
        "id_city": "2815",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Tumsar",
        "id_city": "2841",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Umred",
        "id_city": "2849",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vada",
        "id_city": "2854",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Yerkheda",
        "id_city": "2883",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Wangoi",
        "id_city": "2917",
        "state_name": "Manipur"
      },
      {
        "city_name": "Aizawl",
        "id_city": "2935",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Mamit",
        "id_city": "2947",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Saitul",
        "id_city": "2951",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Cuttack",
        "id_city": "3014",
        "state_name": "Odisha"
      },
      {
        "city_name": "Brahmapuri",
        "id_city": "2526",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Daryapur",
        "id_city": "2551",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Digdoh",
        "id_city": "2568",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Ganeshpur",
        "id_city": "2583",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Gangakher",
        "id_city": "2584",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jaisinghpur",
        "id_city": "2602",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Jaysingpur",
        "id_city": "2607",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kalamnuri",
        "id_city": "2614",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Latur",
        "id_city": "2668",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mangalvedhe",
        "id_city": "2685",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shirpur",
        "id_city": "2804",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shrirampur",
        "id_city": "2809",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Sillewada",
        "id_city": "2811",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Thane",
        "id_city": "2836",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Umbar Pada Nandade",
        "id_city": "2848",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Uran Islampur",
        "id_city": "2852",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bijoy Govinda",
        "id_city": "2885",
        "state_name": "Manipur"
      },
      {
        "city_name": "Lilong",
        "id_city": "2899",
        "state_name": "Manipur"
      },
      {
        "city_name": "Porompat",
        "id_city": "2907",
        "state_name": "Manipur"
      },
      {
        "city_name": "Yairipok",
        "id_city": "2918",
        "state_name": "Manipur"
      },
      {
        "city_name": "Tura",
        "id_city": "2933",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Bairabi",
        "id_city": "2936",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Kolasib",
        "id_city": "2944",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Lunglei",
        "id_city": "2946",
        "state_name": "Mizoram"
      },
      {
        "city_name": "Chumukedima",
        "id_city": "2957",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Tuensang",
        "id_city": "2963",
        "state_name": "Nagaland"
      },
      {
        "city_name": "Angul",
        "id_city": "2967",
        "state_name": "Odisha"
      },
      {
        "city_name": "Balugaon",
        "id_city": "2976",
        "state_name": "Odisha"
      },
      {
        "city_name": "Binika",
        "id_city": "2996",
        "state_name": "Odisha"
      },
      {
        "city_name": "Brahmapur",
        "id_city": "3000",
        "state_name": "Odisha"
      },
      {
        "city_name": "Byasanagar",
        "id_city": "3004",
        "state_name": "Odisha"
      },
      {
        "city_name": "Chitrakonda",
        "id_city": "3012",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bhingar",
        "id_city": "2514",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bhokhardan",
        "id_city": "2516",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Bhum",
        "id_city": "2519",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Chandrapur",
        "id_city": "2533",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Dabhol",
        "id_city": "2545",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Kudal",
        "id_city": "2660",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Lonavala",
        "id_city": "2672",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mahad",
        "id_city": "2675",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Murud",
        "id_city": "2711",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shirgaon",
        "id_city": "2803",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Shrirampur Rural",
        "id_city": "2810",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Umarga",
        "id_city": "2845",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Vadgaon Kasba",
        "id_city": "2856",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Yeola",
        "id_city": "2882",
        "state_name": "Maharashtra"
      },
      {
        "city_name": "Mawlai",
        "id_city": "2924",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Williamnagar",
        "id_city": "2934",
        "state_name": "Meghalaya"
      },
      {
        "city_name": "Baripada",
        "id_city": "2983",
        "state_name": "Odisha"
      },
      {
        "city_name": "Daitari",
        "id_city": "3016",
        "state_name": "Odisha"
      },
      {
        "city_name": "Joda",
        "id_city": "3042",
        "state_name": "Odisha"
      },
      {
        "city_name": "Parlakimidi",
        "id_city": "3084",
        "state_name": "Odisha"
      },
      {
        "city_name": "Raurkela Civil Township",
        "id_city": "3097",
        "state_name": "Odisha"
      },
      {
        "city_name": "Villianur",
        "id_city": "3125",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Dasuya",
        "id_city": "3166",
        "state_name": "Punjab"
      },
      {
        "city_name": "Fatehgarh Sahib",
        "id_city": "3181",
        "state_name": "Punjab"
      },
      {
        "city_name": "Firozpur Cantonment",
        "id_city": "3184",
        "state_name": "Punjab"
      },
      {
        "city_name": "Ghanaur",
        "id_city": "3188",
        "state_name": "Punjab"
      },
      {
        "city_name": "Makhu",
        "id_city": "3229",
        "state_name": "Punjab"
      },
      {
        "city_name": "Muktsar",
        "id_city": "3241",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sardulgarh",
        "id_city": "3278",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sri Hargobindpur",
        "id_city": "3283",
        "state_name": "Punjab"
      },
      {
        "city_name": "Tarn Taran",
        "id_city": "3290",
        "state_name": "Punjab"
      },
      {
        "city_name": "Ajmer",
        "id_city": "3295",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dhariawad",
        "id_city": "3356",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dholpur",
        "id_city": "3358",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kaman",
        "id_city": "3389",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kekri",
        "id_city": "3396",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kuchaman",
        "id_city": "3412",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ladnun",
        "id_city": "3419",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Padampur",
        "id_city": "3460",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pilani",
        "id_city": "3468",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ratan Nagar",
        "id_city": "3487",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Gopalpur",
        "id_city": "3027",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kharhial Road",
        "id_city": "3059",
        "state_name": "Odisha"
      },
      {
        "city_name": "Konark",
        "id_city": "3064",
        "state_name": "Odisha"
      },
      {
        "city_name": "Nuapada",
        "id_city": "3078",
        "state_name": "Odisha"
      },
      {
        "city_name": "Pratapsasan",
        "id_city": "3090",
        "state_name": "Odisha"
      },
      {
        "city_name": "Sambalpur",
        "id_city": "3103",
        "state_name": "Odisha"
      },
      {
        "city_name": "Mahe",
        "id_city": "3122",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Amritsar Cantonment",
        "id_city": "3135",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dirba",
        "id_city": "3176",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kapurthala",
        "id_city": "3208",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kot Kapura",
        "id_city": "3218",
        "state_name": "Punjab"
      },
      {
        "city_name": "Phillaur",
        "id_city": "3259",
        "state_name": "Punjab"
      },
      {
        "city_name": "Rahon",
        "id_city": "3261",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bharatpur",
        "id_city": "3323",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chomun",
        "id_city": "3347",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ganganagar",
        "id_city": "3368",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Gothra",
        "id_city": "3371",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kaprain",
        "id_city": "3393",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kishangarh Ranwal",
        "id_city": "3408",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kolvi Rajendrapura",
        "id_city": "3409",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Losal",
        "id_city": "3422",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nagar",
        "id_city": "3443",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pilibanga",
        "id_city": "3469",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rajsamand",
        "id_city": "3482",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kamakhyanagar",
        "id_city": "3044",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kavisuryanagar",
        "id_city": "3050",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kodala",
        "id_city": "3063",
        "state_name": "Odisha"
      },
      {
        "city_name": "Phulabani",
        "id_city": "3087",
        "state_name": "Odisha"
      },
      {
        "city_name": "Pipili",
        "id_city": "3088",
        "state_name": "Odisha"
      },
      {
        "city_name": "Raj Gangpur",
        "id_city": "3094",
        "state_name": "Odisha"
      },
      {
        "city_name": "Sonepur",
        "id_city": "3105",
        "state_name": "Odisha"
      },
      {
        "city_name": "Udala",
        "id_city": "3115",
        "state_name": "Odisha"
      },
      {
        "city_name": "Ozhukarai",
        "id_city": "3123",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Bhulath",
        "id_city": "3161",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dhilwan",
        "id_city": "3173",
        "state_name": "Punjab"
      },
      {
        "city_name": "Faridkot",
        "id_city": "3178",
        "state_name": "Punjab"
      },
      {
        "city_name": "Gurdaspur",
        "id_city": "3193",
        "state_name": "Punjab"
      },
      {
        "city_name": "Jandiala",
        "id_city": "3205",
        "state_name": "Punjab"
      },
      {
        "city_name": "Mohali",
        "id_city": "3237",
        "state_name": "Punjab"
      },
      {
        "city_name": "Samana",
        "id_city": "3272",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sanaur",
        "id_city": "3274",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sultanpur Lodhi",
        "id_city": "3285",
        "state_name": "Punjab"
      },
      {
        "city_name": "Barmer",
        "id_city": "3313",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhadra",
        "id_city": "3321",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhinmal",
        "id_city": "3329",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bundi",
        "id_city": "3337",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chhabra",
        "id_city": "3340",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chhapar",
        "id_city": "3341",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chittorgarh",
        "id_city": "3346",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Deoli",
        "id_city": "3352",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Falna",
        "id_city": "3363",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Govindgarh",
        "id_city": "3372",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jaiselmer",
        "id_city": "3380",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jhalrapatan",
        "id_city": "3384",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kiranipura",
        "id_city": "3406",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mahwa",
        "id_city": "3425",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Manohar Thana",
        "id_city": "3433",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Marwar",
        "id_city": "3435",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mount Abu",
        "id_city": "3438",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mundwa",
        "id_city": "3440",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pasoond",
        "id_city": "3464",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rajgarh",
        "id_city": "3481",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Raniwara",
        "id_city": "3486",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sangod",
        "id_city": "3501",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dadhapatna",
        "id_city": "3015",
        "state_name": "Odisha"
      },
      {
        "city_name": "Hatibandha",
        "id_city": "3030",
        "state_name": "Odisha"
      },
      {
        "city_name": "Junagarh",
        "id_city": "3043",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kendujhar",
        "id_city": "3052",
        "state_name": "Odisha"
      },
      {
        "city_name": "Lanjigarh",
        "id_city": "3067",
        "state_name": "Odisha"
      },
      {
        "city_name": "Puri",
        "id_city": "3091",
        "state_name": "Odisha"
      },
      {
        "city_name": "Baretta",
        "id_city": "3143",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bharoli Kalan",
        "id_city": "3154",
        "state_name": "Punjab"
      },
      {
        "city_name": "Budhlada",
        "id_city": "3163",
        "state_name": "Punjab"
      },
      {
        "city_name": "Gardhiwala",
        "id_city": "3185",
        "state_name": "Punjab"
      },
      {
        "city_name": "Garhshankar",
        "id_city": "3186",
        "state_name": "Punjab"
      },
      {
        "city_name": "Jalalabad",
        "id_city": "3202",
        "state_name": "Punjab"
      },
      {
        "city_name": "Malerkotla",
        "id_city": "3231",
        "state_name": "Punjab"
      },
      {
        "city_name": "Mukerian",
        "id_city": "3240",
        "state_name": "Punjab"
      },
      {
        "city_name": "Payal",
        "id_city": "3257",
        "state_name": "Punjab"
      },
      {
        "city_name": "Ram Das",
        "id_city": "3265",
        "state_name": "Punjab"
      },
      {
        "city_name": "Samrala",
        "id_city": "3273",
        "state_name": "Punjab"
      },
      {
        "city_name": "Amet",
        "id_city": "3298",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Asind",
        "id_city": "3301",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Baswa",
        "id_city": "3316",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Devli",
        "id_city": "3355",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Gulabpura",
        "id_city": "3373",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Hindaun",
        "id_city": "3375",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jodhpur",
        "id_city": "3387",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kanor",
        "id_city": "3391",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Lakheri",
        "id_city": "3420",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mandal",
        "id_city": "3428",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Merta",
        "id_city": "3436",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nadbai",
        "id_city": "3441",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nawa",
        "id_city": "3449",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Shahpura",
        "id_city": "3507",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sikar",
        "id_city": "3509",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Digapahandi",
        "id_city": "3022",
        "state_name": "Odisha"
      },
      {
        "city_name": "Hirakud",
        "id_city": "3032",
        "state_name": "Odisha"
      },
      {
        "city_name": "Amritsar",
        "id_city": "3134",
        "state_name": "Punjab"
      },
      {
        "city_name": "Badhni Kalan",
        "id_city": "3137",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhabat",
        "id_city": "3151",
        "state_name": "Punjab"
      },
      {
        "city_name": "Daulatpur",
        "id_city": "3167",
        "state_name": "Punjab"
      },
      {
        "city_name": "Firozpur",
        "id_city": "3183",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kalanaur",
        "id_city": "3207",
        "state_name": "Punjab"
      },
      {
        "city_name": "Nangal",
        "id_city": "3248",
        "state_name": "Punjab"
      },
      {
        "city_name": "Nawashahr",
        "id_city": "3249",
        "state_name": "Punjab"
      },
      {
        "city_name": "Nehon",
        "id_city": "3251",
        "state_name": "Punjab"
      },
      {
        "city_name": "Pathankot",
        "id_city": "3253",
        "state_name": "Punjab"
      },
      {
        "city_name": "Raja Sansi",
        "id_city": "3263",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sansarpur",
        "id_city": "3277",
        "state_name": "Punjab"
      },
      {
        "city_name": "Zira",
        "id_city": "3292",
        "state_name": "Punjab"
      },
      {
        "city_name": "Aklera",
        "id_city": "3296",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Anupgarh",
        "id_city": "3300",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Baran",
        "id_city": "3310",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhindar",
        "id_city": "3328",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bissau",
        "id_city": "3334",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dungarpur",
        "id_city": "3362",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jalore",
        "id_city": "3382",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kankroli",
        "id_city": "3390",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Karauli",
        "id_city": "3395",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Khetri",
        "id_city": "3405",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kumbhkot",
        "id_city": "3415",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kushalgarh",
        "id_city": "3417",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Madanganj",
        "id_city": "3423",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mahu Kalan",
        "id_city": "3424",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Naraina",
        "id_city": "3446",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Newa Talai",
        "id_city": "3453",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pali",
        "id_city": "3461",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Parvatsar",
        "id_city": "3463",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Phalodi",
        "id_city": "3466",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pirawa",
        "id_city": "3473",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rajakhera",
        "id_city": "3479",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sambhar",
        "id_city": "3497",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sarwar",
        "id_city": "3503",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sheoganj",
        "id_city": "3508",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dungamal",
        "id_city": "3023",
        "state_name": "Odisha"
      },
      {
        "city_name": "Fertilizer Corporation of Indi",
        "id_city": "3024",
        "state_name": "Odisha"
      },
      {
        "city_name": "Jaleswar",
        "id_city": "3036",
        "state_name": "Odisha"
      },
      {
        "city_name": "Makundapur",
        "id_city": "3069",
        "state_name": "Odisha"
      },
      {
        "city_name": "Rairangpur",
        "id_city": "3093",
        "state_name": "Odisha"
      },
      {
        "city_name": "Rambha",
        "id_city": "3095",
        "state_name": "Odisha"
      },
      {
        "city_name": "Karaikal",
        "id_city": "3120",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Balachaur",
        "id_city": "3139",
        "state_name": "Punjab"
      },
      {
        "city_name": "Banur",
        "id_city": "3142",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhikhi",
        "id_city": "3156",
        "state_name": "Punjab"
      },
      {
        "city_name": "Chohal",
        "id_city": "3165",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dhuri",
        "id_city": "3174",
        "state_name": "Punjab"
      },
      {
        "city_name": "Goraya",
        "id_city": "3192",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kot Fatta",
        "id_city": "3216",
        "state_name": "Punjab"
      },
      {
        "city_name": "Majitha",
        "id_city": "3228",
        "state_name": "Punjab"
      },
      {
        "city_name": "Nabha",
        "id_city": "3246",
        "state_name": "Punjab"
      },
      {
        "city_name": "Nakodar",
        "id_city": "3247",
        "state_name": "Punjab"
      },
      {
        "city_name": "Rurki Kasba",
        "id_city": "3270",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sham Churasi",
        "id_city": "3280",
        "state_name": "Punjab"
      },
      {
        "city_name": "Begun",
        "id_city": "3319",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Devgarh",
        "id_city": "3354",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dhaulpur",
        "id_city": "3357",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dig",
        "id_city": "3360",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jahazpur",
        "id_city": "3377",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Khanpur",
        "id_city": "3401",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kot Putli",
        "id_city": "3410",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kota",
        "id_city": "3411",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nohar",
        "id_city": "3457",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pipar",
        "id_city": "3472",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pushkar",
        "id_city": "3476",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Raipur",
        "id_city": "3477",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sadulshahar",
        "id_city": "3494",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Samdari",
        "id_city": "3498",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sanchor",
        "id_city": "3499",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sirohi",
        "id_city": "3510",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kendrapara",
        "id_city": "3051",
        "state_name": "Odisha"
      },
      {
        "city_name": "Khalikote",
        "id_city": "3056",
        "state_name": "Odisha"
      },
      {
        "city_name": "Mukhiguda",
        "id_city": "3071",
        "state_name": "Odisha"
      },
      {
        "city_name": "Paradwip",
        "id_city": "3083",
        "state_name": "Odisha"
      },
      {
        "city_name": "Soro",
        "id_city": "3107",
        "state_name": "Odisha"
      },
      {
        "city_name": "Sunabeda",
        "id_city": "3108",
        "state_name": "Odisha"
      },
      {
        "city_name": "Udayagiri",
        "id_city": "3116",
        "state_name": "Odisha"
      },
      {
        "city_name": "Yanam",
        "id_city": "3126",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Fateh Nangal",
        "id_city": "3179",
        "state_name": "Punjab"
      },
      {
        "city_name": "Hariana",
        "id_city": "3197",
        "state_name": "Punjab"
      },
      {
        "city_name": "Lodhian Khas",
        "id_city": "3223",
        "state_name": "Punjab"
      },
      {
        "city_name": "Ludhiana",
        "id_city": "3225",
        "state_name": "Punjab"
      },
      {
        "city_name": "Machhiwara",
        "id_city": "3226",
        "state_name": "Punjab"
      },
      {
        "city_name": "Muradpura",
        "id_city": "3245",
        "state_name": "Punjab"
      },
      {
        "city_name": "Pattran",
        "id_city": "3256",
        "state_name": "Punjab"
      },
      {
        "city_name": "Zirakpur",
        "id_city": "3293",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bahror",
        "id_city": "3304",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chhipa Barod",
        "id_city": "3342",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dungargarh",
        "id_city": "3361",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Indragarh",
        "id_city": "3376",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jaipur",
        "id_city": "3378",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kherwara Chhaoni",
        "id_city": "3404",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Makrana",
        "id_city": "3426",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Malpura",
        "id_city": "3427",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nathdwara",
        "id_city": "3448",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "One SGM",
        "id_city": "3459",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Partapur",
        "id_city": "3462",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sadri",
        "id_city": "3493",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Salumbar",
        "id_city": "3496",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jaypur",
        "id_city": "3038",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kashinagara",
        "id_city": "3048",
        "state_name": "Odisha"
      },
      {
        "city_name": "Nabarangpur",
        "id_city": "3072",
        "state_name": "Odisha"
      },
      {
        "city_name": "Nimaparha",
        "id_city": "3077",
        "state_name": "Odisha"
      },
      {
        "city_name": "Patnagarh",
        "id_city": "3086",
        "state_name": "Odisha"
      },
      {
        "city_name": "Rayagada",
        "id_city": "3098",
        "state_name": "Odisha"
      },
      {
        "city_name": "Redhakhol",
        "id_city": "3099",
        "state_name": "Odisha"
      },
      {
        "city_name": "Talcher Thermal Power Station ",
        "id_city": "3111",
        "state_name": "Odisha"
      },
      {
        "city_name": "Umarkot",
        "id_city": "3117",
        "state_name": "Odisha"
      },
      {
        "city_name": "Adampur",
        "id_city": "3128",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bariwala",
        "id_city": "3144",
        "state_name": "Punjab"
      },
      {
        "city_name": "Barnala",
        "id_city": "3145",
        "state_name": "Punjab"
      },
      {
        "city_name": "Fatehgarh Churian",
        "id_city": "3180",
        "state_name": "Punjab"
      },
      {
        "city_name": "Jalandhar",
        "id_city": "3203",
        "state_name": "Punjab"
      },
      {
        "city_name": "Jugial",
        "id_city": "3206",
        "state_name": "Punjab"
      },
      {
        "city_name": "Maloud",
        "id_city": "3232",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sirhind",
        "id_city": "3282",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sunam",
        "id_city": "3286",
        "state_name": "Punjab"
      },
      {
        "city_name": "Urmar Tanda",
        "id_city": "3291",
        "state_name": "Punjab"
      },
      {
        "city_name": "Alwar",
        "id_city": "3297",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jhunjhunun",
        "id_city": "3385",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Naenwa",
        "id_city": "3442",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rani",
        "id_city": "3485",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sogariya",
        "id_city": "3512",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ganjam",
        "id_city": "3025",
        "state_name": "Odisha"
      },
      {
        "city_name": "Jharsuguda",
        "id_city": "3040",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kantilo",
        "id_city": "3046",
        "state_name": "Odisha"
      },
      {
        "city_name": "Khandaparha",
        "id_city": "3057",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kotaparh",
        "id_city": "3066",
        "state_name": "Odisha"
      },
      {
        "city_name": "Sorada",
        "id_city": "3106",
        "state_name": "Odisha"
      },
      {
        "city_name": "Ahmedgarh",
        "id_city": "3129",
        "state_name": "Punjab"
      },
      {
        "city_name": "Banga",
        "id_city": "3141",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhankharpur",
        "id_city": "3153",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dera Bassi",
        "id_city": "3169",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dharam Kot",
        "id_city": "3171",
        "state_name": "Punjab"
      },
      {
        "city_name": "Ghagga",
        "id_city": "3187",
        "state_name": "Punjab"
      },
      {
        "city_name": "Handiaya",
        "id_city": "3196",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kotkapura",
        "id_city": "3219",
        "state_name": "Punjab"
      },
      {
        "city_name": "Munak",
        "id_city": "3244",
        "state_name": "Punjab"
      },
      {
        "city_name": "Rajpura",
        "id_city": "3264",
        "state_name": "Punjab"
      },
      {
        "city_name": "Rayya",
        "id_city": "3268",
        "state_name": "Punjab"
      },
      {
        "city_name": "Rupnagar",
        "id_city": "3269",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bagru",
        "id_city": "3303",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Banswara",
        "id_city": "3309",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhasawar",
        "id_city": "3324",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhilwara",
        "id_city": "3327",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bilara",
        "id_city": "3333",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chhoti Sadri",
        "id_city": "3343",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Fatehpur",
        "id_city": "3365",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nimaj",
        "id_city": "3454",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nokha",
        "id_city": "3458",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pratapgarh",
        "id_city": "3475",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dhamanagar",
        "id_city": "3020",
        "state_name": "Odisha"
      },
      {
        "city_name": "Ghantapada",
        "id_city": "3026",
        "state_name": "Odisha"
      },
      {
        "city_name": "Gunupur",
        "id_city": "3029",
        "state_name": "Odisha"
      },
      {
        "city_name": "Hinjilikatu",
        "id_city": "3031",
        "state_name": "Odisha"
      },
      {
        "city_name": "Jatni",
        "id_city": "3037",
        "state_name": "Odisha"
      },
      {
        "city_name": "Keonjhar",
        "id_city": "3053",
        "state_name": "Odisha"
      },
      {
        "city_name": "Khaliapali",
        "id_city": "3055",
        "state_name": "Odisha"
      },
      {
        "city_name": "Tarabha",
        "id_city": "3112",
        "state_name": "Odisha"
      },
      {
        "city_name": "Abohar",
        "id_city": "3127",
        "state_name": "Punjab"
      },
      {
        "city_name": "Amloh",
        "id_city": "3133",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhawanigarh",
        "id_city": "3155",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhogpur",
        "id_city": "3159",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhuch",
        "id_city": "3160",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dhanaula",
        "id_city": "3170",
        "state_name": "Punjab"
      },
      {
        "city_name": "Guru Har Sahai",
        "id_city": "3194",
        "state_name": "Punjab"
      },
      {
        "city_name": "Maur",
        "id_city": "3235",
        "state_name": "Punjab"
      },
      {
        "city_name": "Morinda",
        "id_city": "3239",
        "state_name": "Punjab"
      },
      {
        "city_name": "Raikot",
        "id_city": "3262",
        "state_name": "Punjab"
      },
      {
        "city_name": "Shahkot",
        "id_city": "3279",
        "state_name": "Punjab"
      },
      {
        "city_name": "Tappa",
        "id_city": "3289",
        "state_name": "Punjab"
      },
      {
        "city_name": "Antah",
        "id_city": "3299",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Basi",
        "id_city": "3314",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhalariya",
        "id_city": "3322",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dariba",
        "id_city": "3350",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Khairthal",
        "id_city": "3399",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kishangarh",
        "id_city": "3407",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pindwara",
        "id_city": "3470",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Raisinghnagar",
        "id_city": "3478",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ramganj Mandi",
        "id_city": "3483",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ringas",
        "id_city": "3492",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sawai Madhopur",
        "id_city": "3505",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Damanjodi",
        "id_city": "3017",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kharhial",
        "id_city": "3058",
        "state_name": "Odisha"
      },
      {
        "city_name": "Khatiguda",
        "id_city": "3060",
        "state_name": "Odisha"
      },
      {
        "city_name": "Lattikata",
        "id_city": "3068",
        "state_name": "Odisha"
      },
      {
        "city_name": "Nayagarh",
        "id_city": "3075",
        "state_name": "Odisha"
      },
      {
        "city_name": "OCL Industrialship",
        "id_city": "3080",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bagh Purana",
        "id_city": "3138",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhikhiwind",
        "id_city": "3157",
        "state_name": "Punjab"
      },
      {
        "city_name": "Hajipur",
        "id_city": "3195",
        "state_name": "Punjab"
      },
      {
        "city_name": "Hoshiarpur",
        "id_city": "3198",
        "state_name": "Punjab"
      },
      {
        "city_name": "Khem Karan",
        "id_city": "3215",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kot Isa Khan",
        "id_city": "3217",
        "state_name": "Punjab"
      },
      {
        "city_name": "Malaut",
        "id_city": "3230",
        "state_name": "Punjab"
      },
      {
        "city_name": "Nurmahal",
        "id_city": "3252",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sangrur",
        "id_city": "3276",
        "state_name": "Punjab"
      },
      {
        "city_name": "Shekhpura",
        "id_city": "3281",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bagar",
        "id_city": "3302",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhawani Mandi",
        "id_city": "3325",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bikaner",
        "id_city": "3332",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chatsu",
        "id_city": "3338",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chechat",
        "id_city": "3339",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kesrisinghpur",
        "id_city": "3398",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kuchera",
        "id_city": "3413",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Napasar",
        "id_city": "3445",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nimbahera",
        "id_city": "3455",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pokaran",
        "id_city": "3474",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sardarshahr",
        "id_city": "3502",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Deogarh",
        "id_city": "3018",
        "state_name": "Odisha"
      },
      {
        "city_name": "Jhumpura",
        "id_city": "3041",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kochinda",
        "id_city": "3062",
        "state_name": "Odisha"
      },
      {
        "city_name": "Koraput",
        "id_city": "3065",
        "state_name": "Odisha"
      },
      {
        "city_name": "Padampur",
        "id_city": "3081",
        "state_name": "Odisha"
      },
      {
        "city_name": "Patamundai",
        "id_city": "3085",
        "state_name": "Odisha"
      },
      {
        "city_name": "Raurkela",
        "id_city": "3096",
        "state_name": "Odisha"
      },
      {
        "city_name": "Talcher",
        "id_city": "3110",
        "state_name": "Odisha"
      },
      {
        "city_name": "Vikrampur",
        "id_city": "3118",
        "state_name": "Odisha"
      },
      {
        "city_name": "Alawalpur",
        "id_city": "3132",
        "state_name": "Punjab"
      },
      {
        "city_name": "Chima",
        "id_city": "3164",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dera Baba Nanak",
        "id_city": "3168",
        "state_name": "Punjab"
      },
      {
        "city_name": "Gobindgarh",
        "id_city": "3190",
        "state_name": "Punjab"
      },
      {
        "city_name": "Jaitu",
        "id_city": "3201",
        "state_name": "Punjab"
      },
      {
        "city_name": "Karoran",
        "id_city": "3209",
        "state_name": "Punjab"
      },
      {
        "city_name": "Khanauri",
        "id_city": "3212",
        "state_name": "Punjab"
      },
      {
        "city_name": "Khanna",
        "id_city": "3213",
        "state_name": "Punjab"
      },
      {
        "city_name": "Lalru",
        "id_city": "3221",
        "state_name": "Punjab"
      },
      {
        "city_name": "Lehra Gaga",
        "id_city": "3222",
        "state_name": "Punjab"
      },
      {
        "city_name": "Moonak",
        "id_city": "3238",
        "state_name": "Punjab"
      },
      {
        "city_name": "Mullanpur Dakha",
        "id_city": "3242",
        "state_name": "Punjab"
      },
      {
        "city_name": "Mullanpur Garibdas",
        "id_city": "3243",
        "state_name": "Punjab"
      },
      {
        "city_name": "Naya Nangal",
        "id_city": "3250",
        "state_name": "Punjab"
      },
      {
        "city_name": "Talwandi Bhai",
        "id_city": "3287",
        "state_name": "Punjab"
      },
      {
        "city_name": "Balotra",
        "id_city": "3307",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bari Sadri",
        "id_city": "3312",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhiwadi",
        "id_city": "3330",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Borkhera",
        "id_city": "3335",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Budhpura",
        "id_city": "3336",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chittaurgarh",
        "id_city": "3345",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dausa",
        "id_city": "3351",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Keshorai Patan",
        "id_city": "3397",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kherliganj",
        "id_city": "3403",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mangrol",
        "id_city": "3432",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ratangarh",
        "id_city": "3488",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sewan Kalan",
        "id_city": "3506",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Dhenkanal",
        "id_city": "3021",
        "state_name": "Odisha"
      },
      {
        "city_name": "Nalco",
        "id_city": "3073",
        "state_name": "Odisha"
      },
      {
        "city_name": "Nuapatna",
        "id_city": "3079",
        "state_name": "Odisha"
      },
      {
        "city_name": "Rourkela",
        "id_city": "3102",
        "state_name": "Odisha"
      },
      {
        "city_name": "Bassi Pathana",
        "id_city": "3146",
        "state_name": "Punjab"
      },
      {
        "city_name": "Behrampur",
        "id_city": "3150",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhisiana",
        "id_city": "3158",
        "state_name": "Punjab"
      },
      {
        "city_name": "Budha Theh",
        "id_city": "3162",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kurali",
        "id_city": "3220",
        "state_name": "Punjab"
      },
      {
        "city_name": "Moga",
        "id_city": "3236",
        "state_name": "Punjab"
      },
      {
        "city_name": "Raman",
        "id_city": "3266",
        "state_name": "Punjab"
      },
      {
        "city_name": "Abu Road",
        "id_city": "3294",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bakani",
        "id_city": "3305",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhawri",
        "id_city": "3326",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Chirawa",
        "id_city": "3344",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Gajsinghpur",
        "id_city": "3366",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jhalawar",
        "id_city": "3383",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kapasan",
        "id_city": "3392",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rawatsar",
        "id_city": "3490",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Siwana",
        "id_city": "3511",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Deracolliery",
        "id_city": "3019",
        "state_name": "Odisha"
      },
      {
        "city_name": "Gudari",
        "id_city": "3028",
        "state_name": "Odisha"
      },
      {
        "city_name": "Jagatsinghapur",
        "id_city": "3033",
        "state_name": "Odisha"
      },
      {
        "city_name": "Jeypore",
        "id_city": "3039",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kesinga",
        "id_city": "3054",
        "state_name": "Odisha"
      },
      {
        "city_name": "Malkangiri",
        "id_city": "3070",
        "state_name": "Odisha"
      },
      {
        "city_name": "Naurangapur",
        "id_city": "3074",
        "state_name": "Odisha"
      },
      {
        "city_name": "Polasara",
        "id_city": "3089",
        "state_name": "Odisha"
      },
      {
        "city_name": "Sinapali",
        "id_city": "3104",
        "state_name": "Odisha"
      },
      {
        "city_name": "Titlagarh",
        "id_city": "3114",
        "state_name": "Odisha"
      },
      {
        "city_name": "Ajnala",
        "id_city": "3130",
        "state_name": "Punjab"
      },
      {
        "city_name": "Akalgarh",
        "id_city": "3131",
        "state_name": "Punjab"
      },
      {
        "city_name": "Doraha",
        "id_city": "3177",
        "state_name": "Punjab"
      },
      {
        "city_name": "Fazilka",
        "id_city": "3182",
        "state_name": "Punjab"
      },
      {
        "city_name": "Jalandhar Cantonment",
        "id_city": "3204",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kartarpur",
        "id_city": "3210",
        "state_name": "Punjab"
      },
      {
        "city_name": "Kharar",
        "id_city": "3214",
        "state_name": "Punjab"
      },
      {
        "city_name": "Patiala",
        "id_city": "3254",
        "state_name": "Punjab"
      },
      {
        "city_name": "Patti",
        "id_city": "3255",
        "state_name": "Punjab"
      },
      {
        "city_name": "Phagwara",
        "id_city": "3258",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bari",
        "id_city": "3311",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Basni Belima",
        "id_city": "3315",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Beawar",
        "id_city": "3318",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bijoliya Kalan",
        "id_city": "3331",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Churu",
        "id_city": "3348",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Didwana",
        "id_city": "3359",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Galiakot",
        "id_city": "3367",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Gangapur",
        "id_city": "3369",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jaisalmer",
        "id_city": "3379",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jaitaran",
        "id_city": "3381",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Karanpura",
        "id_city": "3394",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kumbhalgarh",
        "id_city": "3414",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Modak",
        "id_city": "3437",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mukandgarh",
        "id_city": "3439",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Neemrana",
        "id_city": "3452",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rajaldesar",
        "id_city": "3480",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sagwara",
        "id_city": "3495",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jajpur",
        "id_city": "3034",
        "state_name": "Odisha"
      },
      {
        "city_name": "Jalda",
        "id_city": "3035",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kantabanji",
        "id_city": "3045",
        "state_name": "Odisha"
      },
      {
        "city_name": "Karanja",
        "id_city": "3047",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kataka",
        "id_city": "3049",
        "state_name": "Odisha"
      },
      {
        "city_name": "Nilagiri",
        "id_city": "3076",
        "state_name": "Odisha"
      },
      {
        "city_name": "Paradip",
        "id_city": "3082",
        "state_name": "Odisha"
      },
      {
        "city_name": "Remuna",
        "id_city": "3100",
        "state_name": "Odisha"
      },
      {
        "city_name": "Rengali",
        "id_city": "3101",
        "state_name": "Odisha"
      },
      {
        "city_name": "Sundargarh",
        "id_city": "3109",
        "state_name": "Odisha"
      },
      {
        "city_name": "Ariankuppam",
        "id_city": "3119",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Pondicherry",
        "id_city": "3124",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Batala",
        "id_city": "3147",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bathinda",
        "id_city": "3148",
        "state_name": "Punjab"
      },
      {
        "city_name": "Begowal",
        "id_city": "3149",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bhadur",
        "id_city": "3152",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dinanagar",
        "id_city": "3175",
        "state_name": "Punjab"
      },
      {
        "city_name": "Giddarbaha",
        "id_city": "3189",
        "state_name": "Punjab"
      },
      {
        "city_name": "Goniana",
        "id_city": "3191",
        "state_name": "Punjab"
      },
      {
        "city_name": "Hussainpur",
        "id_city": "3199",
        "state_name": "Punjab"
      },
      {
        "city_name": "Longowal",
        "id_city": "3224",
        "state_name": "Punjab"
      },
      {
        "city_name": "Mahilpur",
        "id_city": "3227",
        "state_name": "Punjab"
      },
      {
        "city_name": "Mansa",
        "id_city": "3234",
        "state_name": "Punjab"
      },
      {
        "city_name": "Rampura",
        "id_city": "3267",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sahnewal",
        "id_city": "3271",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sangat",
        "id_city": "3275",
        "state_name": "Punjab"
      },
      {
        "city_name": "Talwara",
        "id_city": "3288",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bali",
        "id_city": "3306",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bandikui",
        "id_city": "3308",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Bhadasar",
        "id_city": "3320",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Goredi Chancha",
        "id_city": "3370",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nagaur",
        "id_city": "3444",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nasirabad",
        "id_city": "3447",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Nawalgarh",
        "id_city": "3450",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Phalna",
        "id_city": "3465",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Phulera",
        "id_city": "3467",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Pipalia Kalan",
        "id_city": "3471",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ramgarh",
        "id_city": "3484",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rawatbhata",
        "id_city": "3489",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Satal Kheri",
        "id_city": "3504",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sojat",
        "id_city": "3513",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Khurda",
        "id_city": "3061",
        "state_name": "Odisha"
      },
      {
        "city_name": "Purushottampur",
        "id_city": "3092",
        "state_name": "Odisha"
      },
      {
        "city_name": "Tensa",
        "id_city": "3113",
        "state_name": "Odisha"
      },
      {
        "city_name": "Kurumbapet",
        "id_city": "3121",
        "state_name": "Pondicherry"
      },
      {
        "city_name": "Anandpur Sahib",
        "id_city": "3136",
        "state_name": "Punjab"
      },
      {
        "city_name": "Banaur",
        "id_city": "3140",
        "state_name": "Punjab"
      },
      {
        "city_name": "Dhariwal",
        "id_city": "3172",
        "state_name": "Punjab"
      },
      {
        "city_name": "Jagraon",
        "id_city": "3200",
        "state_name": "Punjab"
      },
      {
        "city_name": "Khamanon",
        "id_city": "3211",
        "state_name": "Punjab"
      },
      {
        "city_name": "Mandi Gobindgarh",
        "id_city": "3233",
        "state_name": "Punjab"
      },
      {
        "city_name": "Qadian",
        "id_city": "3260",
        "state_name": "Punjab"
      },
      {
        "city_name": "Sujanpur",
        "id_city": "3284",
        "state_name": "Punjab"
      },
      {
        "city_name": "Bayana",
        "id_city": "3317",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Daosa",
        "id_city": "3349",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Deshnok",
        "id_city": "3353",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Fatehnagar",
        "id_city": "3364",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Hanumangarh",
        "id_city": "3374",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jobner",
        "id_city": "3386",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kaithun",
        "id_city": "3388",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Khandela",
        "id_city": "3400",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kherli",
        "id_city": "3402",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Kumher",
        "id_city": "3416",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Lachhmangarh",
        "id_city": "3418",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Lalsot",
        "id_city": "3421",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mandalgarh",
        "id_city": "3429",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mandawar",
        "id_city": "3430",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mandwa",
        "id_city": "3431",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Manoharpur",
        "id_city": "3434",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Neem Ka Thana",
        "id_city": "3451",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Niwai",
        "id_city": "3456",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rikhabdev",
        "id_city": "3491",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sangariya",
        "id_city": "3500",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sojat Road",
        "id_city": "3514",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Sunel",
        "id_city": "3520",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Toda Raisingh",
        "id_city": "3529",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Vanasthali",
        "id_city": "3535",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Achipatti",
        "id_city": "3555",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Appakudal",
        "id_city": "3596",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Aravankadu",
        "id_city": "3606",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arumbavur",
        "id_city": "3615",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Devakottai",
        "id_city": "3693",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Eraniel",
        "id_city": "3712",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Eriodu",
        "id_city": "3713",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Eruvadi",
        "id_city": "3716",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gangavalli",
        "id_city": "3724",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ganguvarpatti",
        "id_city": "3725",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karuppur",
        "id_city": "3810",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kasipalaiyam",
        "id_city": "3812",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kattivakkam",
        "id_city": "3817",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kilvelur",
        "id_city": "3838",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Konganapuram",
        "id_city": "3862",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kottivakkam",
        "id_city": "3870",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kulasekarappattinam",
        "id_city": "3879",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kumbakonam",
        "id_city": "3885",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madhavaram",
        "id_city": "3908",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Milavittan",
        "id_city": "3967",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mullakkadu",
        "id_city": "3982",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nagercoil",
        "id_city": "3996",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nambutalai",
        "id_city": "4003",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nazarethpettai",
        "id_city": "4025",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Neikkarapatti",
        "id_city": "4027",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Suratgarh",
        "id_city": "3522",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Wer",
        "id_city": "3539",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Upper Tadong",
        "id_city": "3550",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Akkaraipettai",
        "id_city": "3562",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alandur",
        "id_city": "3566",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alwarkurichi",
        "id_city": "3576",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Anaiyur",
        "id_city": "3585",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arimalam",
        "id_city": "3608",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chembarambakkam",
        "id_city": "3656",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chittodu",
        "id_city": "3681",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Darasuram",
        "id_city": "3688",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gudiyattam",
        "id_city": "3730",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gummidipoondi",
        "id_city": "3732",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Inam Karur",
        "id_city": "3746",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Jayankondam",
        "id_city": "3754",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Jolarpet",
        "id_city": "3755",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kangayam",
        "id_city": "3785",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kannankurichi",
        "id_city": "3793",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karamadai",
        "id_city": "3799",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kilkulam",
        "id_city": "3833",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kollankodu",
        "id_city": "3854",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Llayangudi",
        "id_city": "3904",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Maduravoyal",
        "id_city": "3914",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Masinigudi",
        "id_city": "3947",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Minakshipuram",
        "id_city": "3968",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mopperipalayam",
        "id_city": "3973",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mukasipidariyur",
        "id_city": "3977",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Naravarikuppam",
        "id_city": "4016",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sriganganagar",
        "id_city": "3516",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "No City",
        "id_city": "3546",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Acharapakkam",
        "id_city": "3553",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alagapuri",
        "id_city": "3564",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alampalayam",
        "id_city": "3565",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alangayam",
        "id_city": "3568",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Allapuram",
        "id_city": "3573",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alwar Tirunagari",
        "id_city": "3575",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ammapettai",
        "id_city": "3581",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Andanappettai",
        "id_city": "3588",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Anjugramam",
        "id_city": "3591",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Annavasal",
        "id_city": "3593",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arani",
        "id_city": "3601",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ashokapuram",
        "id_city": "3618",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bhuvanagiri",
        "id_city": "3649",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Devarshola",
        "id_city": "3695",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dhali",
        "id_city": "3698",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dhaliyur",
        "id_city": "3699",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kadayal",
        "id_city": "3758",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kadayampatti",
        "id_city": "3759",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalakkad",
        "id_city": "3762",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kambam",
        "id_city": "3778",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kangayampalayam",
        "id_city": "3786",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kappiyarai",
        "id_city": "3797",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kariamangalam",
        "id_city": "3802",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kariapatti",
        "id_city": "3803",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karugampattur",
        "id_city": "3804",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kathujuganapalli",
        "id_city": "3815",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kottur",
        "id_city": "3871",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuhalur",
        "id_city": "3878",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kumarapalayam",
        "id_city": "3883",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuthalam",
        "id_city": "3895",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madurai",
        "id_city": "3912",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melathiruppanthuruthi",
        "id_city": "3958",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melpattampakkam",
        "id_city": "3961",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Musiri",
        "id_city": "3984",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Narasojipatti",
        "id_city": "4015",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nattarasankottai",
        "id_city": "4023",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nilagiri",
        "id_city": "4040",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Suket",
        "id_city": "3518",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Tonk",
        "id_city": "3531",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Uniara",
        "id_city": "3534",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Rangpo",
        "id_city": "3547",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Adiramapattinam",
        "id_city": "3557",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alanthurai",
        "id_city": "3571",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Anthiyur",
        "id_city": "3595",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arachalur",
        "id_city": "3597",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arani Road",
        "id_city": "3602",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ariyalur",
        "id_city": "3609",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chengalpattu",
        "id_city": "3657",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinnampalaiyam",
        "id_city": "3677",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Coonoor",
        "id_city": "3684",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dharapuram",
        "id_city": "3701",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Edaganasalai",
        "id_city": "3705",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gangaikondan",
        "id_city": "3723",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gopalasamudram",
        "id_city": "3727",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gudalur",
        "id_city": "3729",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Iluppaiyurani",
        "id_city": "3744",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kamuthi",
        "id_city": "3779",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karambakkam",
        "id_city": "3800",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kaveripakkam",
        "id_city": "3821",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kayalpattinam",
        "id_city": "3825",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kelamangalam",
        "id_city": "3827",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kiramangalam",
        "id_city": "3840",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kolathupalayam",
        "id_city": "3852",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kulasekarapuram",
        "id_city": "3880",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kumarapuram",
        "id_city": "3884",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kurudampalaiyam",
        "id_city": "3893",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Muttayyapuram",
        "id_city": "3987",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Muvarasampettai",
        "id_city": "3989",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nanjikottai",
        "id_city": "4009",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nellikkuppam",
        "id_city": "4029",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nelliyalam",
        "id_city": "4030",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Udaipur",
        "id_city": "3532",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Udpura",
        "id_city": "3533",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Adikaratti",
        "id_city": "3556",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alanganallur",
        "id_city": "3567",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chengam",
        "id_city": "3658",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dindigul",
        "id_city": "3703",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ezhudesam",
        "id_city": "3720",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalappanaickenpatti",
        "id_city": "3765",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kanadukathan",
        "id_city": "3780",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karungal",
        "id_city": "3808",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kathirvedu",
        "id_city": "3814",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kavundampalaiyam",
        "id_city": "3823",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kiranur",
        "id_city": "3841",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Konavattam",
        "id_city": "3860",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Krishnagiri",
        "id_city": "3874",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuttalam",
        "id_city": "3897",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madukkarai",
        "id_city": "3910",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mandapam",
        "id_city": "3933",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Marudur",
        "id_city": "3945",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mylapore",
        "id_city": "3991",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nannilam",
        "id_city": "4010",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nemilicheri",
        "id_city": "4032",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Achampudur",
        "id_city": "3552",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alangulam",
        "id_city": "3570",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Avinashi",
        "id_city": "3631",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Berhatty",
        "id_city": "3646",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bhavani",
        "id_city": "3647",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bhawanisagar",
        "id_city": "3648",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chatrapatti",
        "id_city": "3655",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chidambaram",
        "id_city": "3671",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinna Salem",
        "id_city": "3674",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chitlapakkam",
        "id_city": "3680",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Edakalinadu",
        "id_city": "3707",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Huligal",
        "id_city": "3739",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Jagathala",
        "id_city": "3750",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kadathur",
        "id_city": "3757",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kannivadi",
        "id_city": "3795",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kasipalayam G",
        "id_city": "3813",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kattupakkam",
        "id_city": "3819",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kilkunda",
        "id_city": "3834",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kilpennathur",
        "id_city": "3837",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kochadai",
        "id_city": "3845",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kottakuppam",
        "id_city": "3868",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuchanur",
        "id_city": "3877",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Labbaikudikadu",
        "id_city": "3900",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mappilaiurani",
        "id_city": "3939",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melanattam",
        "id_city": "3957",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mulagumudu",
        "id_city": "3979",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Myladi",
        "id_city": "3990",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Naduvattam",
        "id_city": "3993",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nagavakulam",
        "id_city": "3995",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nasiyanur",
        "id_city": "4017",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nathampannai",
        "id_city": "4019",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Toda Bhim",
        "id_city": "3528",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Vidyavihar",
        "id_city": "3536",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Gangtok",
        "id_city": "3540",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Naya Bazar",
        "id_city": "3545",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Singtam",
        "id_city": "3549",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Alagappapuram",
        "id_city": "3563",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arantangi",
        "id_city": "3603",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Aravakurichi",
        "id_city": "3605",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Balasamudram",
        "id_city": "3643",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bargur",
        "id_city": "3644",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Buthipuram",
        "id_city": "3654",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinna Anuppanadi",
        "id_city": "3673",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Courtalam",
        "id_city": "3685",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dharapadavedu",
        "id_city": "3700",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Hanumanthampatti",
        "id_city": "3733",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Idappadi",
        "id_city": "3740",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Jalakandapuram",
        "id_city": "3751",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kadambur",
        "id_city": "3756",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kadayanallur",
        "id_city": "3760",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalavai",
        "id_city": "3766",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kallidaikurichchi",
        "id_city": "3771",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kamayagoundanpatti",
        "id_city": "3776",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kanyakumari",
        "id_city": "3796",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kinathukadavu",
        "id_city": "3839",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kodaikanal",
        "id_city": "3846",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kolappalur",
        "id_city": "3851",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kunur",
        "id_city": "3889",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Lakkampatti",
        "id_city": "3901",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Makkinanpatti",
        "id_city": "3916",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melachokkanathapuram",
        "id_city": "3953",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Minjur",
        "id_city": "3970",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mudichur",
        "id_city": "3975",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Muruganpalayam",
        "id_city": "3983",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Naranapuram",
        "id_city": "4012",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nemili",
        "id_city": "4031",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nerkuppai",
        "id_city": "4035",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sri Madhopur",
        "id_city": "3515",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Vijainagar",
        "id_city": "3537",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Alangudi",
        "id_city": "3569",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ambur",
        "id_city": "3578",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Andippatti",
        "id_city": "3590",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Annamalainagar",
        "id_city": "3592",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Aralvaimozhi",
        "id_city": "3600",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arulmigu Thirumuruganpundi",
        "id_city": "3613",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arumanai",
        "id_city": "3614",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Cheyur",
        "id_city": "3669",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinnakkampalayam",
        "id_city": "3675",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Coimbatore",
        "id_city": "3683",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Devakkottai",
        "id_city": "3692",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Elumalai",
        "id_city": "3710",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ilanji",
        "id_city": "3743",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Jambai",
        "id_city": "3753",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kanjikoil",
        "id_city": "3789",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kumarapalaiyam",
        "id_city": "3882",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kurumbalur",
        "id_city": "3894",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuthappar",
        "id_city": "3896",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuzhithurai",
        "id_city": "3899",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mattur",
        "id_city": "3949",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mecheri",
        "id_city": "3951",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melvisharam",
        "id_city": "3963",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mohanur",
        "id_city": "3972",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mudalur",
        "id_city": "3974",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mulanur",
        "id_city": "3981",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nandambakkam",
        "id_city": "4004",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nidamangalam",
        "id_city": "4039",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Swaroopganj",
        "id_city": "3523",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Namchi",
        "id_city": "3544",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Aduturai",
        "id_city": "3558",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Agasthiswaram",
        "id_city": "3561",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alapakkam",
        "id_city": "3572",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ayanadaippu",
        "id_city": "3633",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bodinayakkanur",
        "id_city": "3651",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Cheranmadevi",
        "id_city": "3662",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinnasekkadu",
        "id_city": "3678",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Cholapuram",
        "id_city": "3682",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Cuddalore",
        "id_city": "3686",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Desur",
        "id_city": "3690",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dusi",
        "id_city": "3704",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Harur",
        "id_city": "3734",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Jalladiampet",
        "id_city": "3752",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kallakkurichi",
        "id_city": "3769",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kallakudi",
        "id_city": "3770",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kanchipuram",
        "id_city": "3783",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kaniyur",
        "id_city": "3788",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karur",
        "id_city": "3811",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kayattar",
        "id_city": "3826",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Konakkarai",
        "id_city": "3859",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kundrathur",
        "id_city": "3886",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kurinjippadi",
        "id_city": "3892",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Marandahalli",
        "id_city": "3943",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mudukulathur",
        "id_city": "3976",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Muthupet",
        "id_city": "3985",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Muttupet",
        "id_city": "3988",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Narasingapuram",
        "id_city": "4014",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nattam",
        "id_city": "4021",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Viratnagar",
        "id_city": "3538",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Gezing",
        "id_city": "3541",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Ammainaickanur",
        "id_city": "3579",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ammaparikuppam",
        "id_city": "3580",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Belur",
        "id_city": "3645",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dhalavoipuram",
        "id_city": "3697",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Elathur",
        "id_city": "3708",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Erumaipatti",
        "id_city": "3715",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gingi",
        "id_city": "3726",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ilampillai",
        "id_city": "3742",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Injambakkam",
        "id_city": "3747",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kadiapatti",
        "id_city": "3761",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kanakkampalayam",
        "id_city": "3781",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kanam",
        "id_city": "3782",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karumandi Chellipalayam",
        "id_city": "3805",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Katpadi",
        "id_city": "3816",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kavundampalayam",
        "id_city": "3824",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kilampadi",
        "id_city": "3832",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kombai",
        "id_city": "3858",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Koradacheri",
        "id_city": "3863",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kottaiyur",
        "id_city": "3867",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Koyampattur",
        "id_city": "3873",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Krishnarayapuram",
        "id_city": "3875",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Krishnasamudram",
        "id_city": "3876",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madambakkam",
        "id_city": "3905",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Maramangalathupatti",
        "id_city": "3942",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Markayankottai",
        "id_city": "3944",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Namagiripettai",
        "id_city": "4000",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Namakkal",
        "id_city": "4001",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nanguneri",
        "id_city": "4008",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Natrampalli",
        "id_city": "4020",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Takhatgarh",
        "id_city": "3524",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Taranagar",
        "id_city": "3525",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Mangan",
        "id_city": "3543",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Sikkim",
        "id_city": "3548",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Adyar",
        "id_city": "3559",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ayakudi",
        "id_city": "3632",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chennasamudram",
        "id_city": "3660",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chettipalayam Cantonment",
        "id_city": "3667",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinalapatti",
        "id_city": "3672",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Devasthanam",
        "id_city": "3696",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Edaikodu",
        "id_city": "3706",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Eral",
        "id_city": "3711",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ethapur",
        "id_city": "3717",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ettaiyapuram",
        "id_city": "3718",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Hosur",
        "id_city": "3737",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kaliyakkavilai",
        "id_city": "3768",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kiripatti",
        "id_city": "3842",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kolachal",
        "id_city": "3850",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuniyamuthur",
        "id_city": "3887",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madippakkam",
        "id_city": "3909",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Manimutharu",
        "id_city": "3937",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Marakkanam",
        "id_city": "3941",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Marungur",
        "id_city": "3946",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mathigiri",
        "id_city": "3948",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melagaram",
        "id_city": "3954",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melur",
        "id_city": "3962",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Natham",
        "id_city": "4018",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Navalpattu",
        "id_city": "4024",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Neiyyur",
        "id_city": "4028",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sujangarh",
        "id_city": "3517",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Surajgarh",
        "id_city": "3521",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Acharipallam",
        "id_city": "3554",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Agaram",
        "id_city": "3560",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Anakaputhur",
        "id_city": "3586",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Brahmana Periya Agraharam",
        "id_city": "3652",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chennai",
        "id_city": "3659",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Harveypatti",
        "id_city": "3735",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Idikarai",
        "id_city": "3741",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Iluppur",
        "id_city": "3745",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalpakkam",
        "id_city": "3774",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalugumalai",
        "id_city": "3775",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kannadendal",
        "id_city": "3790",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kannampalayam",
        "id_city": "3792",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karumathampatti",
        "id_city": "3806",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kattumannarkoil",
        "id_city": "3818",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kelambakkam",
        "id_city": "3828",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kembainaickenpalayam",
        "id_city": "3829",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Komarapalayam",
        "id_city": "3857",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuraikundu",
        "id_city": "3890",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madathukulam",
        "id_city": "3907",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Maduranthakam",
        "id_city": "3913",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mangalam",
        "id_city": "3935",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mangalampet",
        "id_city": "3936",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melattur",
        "id_city": "3959",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nagojanahalli",
        "id_city": "3997",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nangavaram",
        "id_city": "4007",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Naranammalpuram",
        "id_city": "4011",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Three STR",
        "id_city": "3526",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Tijara",
        "id_city": "3527",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Ammavarikuppam",
        "id_city": "3582",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Anaimalai",
        "id_city": "3584",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ananthapuram",
        "id_city": "3587",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arasiramani",
        "id_city": "3604",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Aruppukkottai",
        "id_city": "3617",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Aygudi",
        "id_city": "3634",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ayyampalayam",
        "id_city": "3637",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Balakrishnapuram",
        "id_city": "3641",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bikketti",
        "id_city": "3650",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Cheruvanki",
        "id_city": "3663",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Cheyyar",
        "id_city": "3670",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dharmapuri",
        "id_city": "3702",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ganapathipuram",
        "id_city": "3721",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Irugur",
        "id_city": "3748",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Jaffrabad",
        "id_city": "3749",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karaikkudi",
        "id_city": "3798",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karumbakkam",
        "id_city": "3807",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kaveripattinam",
        "id_city": "3822",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kethi",
        "id_city": "3830",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kilakarai",
        "id_city": "3831",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kizhapavur",
        "id_city": "3843",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kotagiri",
        "id_city": "3865",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kottaram",
        "id_city": "3869",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kovilpatti",
        "id_city": "3872",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kulithalai",
        "id_city": "3881",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madanur",
        "id_city": "3906",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mayiladuthurai",
        "id_city": "3950",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melamaiyur",
        "id_city": "3956",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mettur",
        "id_city": "3965",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Meyyanur",
        "id_city": "3966",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Modakurichi",
        "id_city": "3971",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Muthur",
        "id_city": "3986",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nambiyur",
        "id_city": "4002",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nandivaram",
        "id_city": "4005",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nangavalli",
        "id_city": "4006",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nerunjipettai",
        "id_city": "4036",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Neyveli",
        "id_city": "4038",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Alur",
        "id_city": "3574",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ammur",
        "id_city": "3583",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Andipalayam",
        "id_city": "3589",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arakandanallur",
        "id_city": "3598",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ariyappampalayam",
        "id_city": "3610",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arumuganeri",
        "id_city": "3616",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Buthapandi",
        "id_city": "3653",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chennimalai",
        "id_city": "3661",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chetpet",
        "id_city": "3664",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chettipalaiyam",
        "id_city": "3666",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinnammanur",
        "id_city": "3676",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chinnavedampatti",
        "id_city": "3679",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ettimadai",
        "id_city": "3719",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kallukuttam",
        "id_city": "3772",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kallupatti",
        "id_city": "3773",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kattuputhur",
        "id_city": "3820",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Killiyur",
        "id_city": "3835",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kodumudi",
        "id_city": "3849",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kolathur",
        "id_city": "3853",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Korampallam",
        "id_city": "3864",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kothinallur",
        "id_city": "3866",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mahabalipuram",
        "id_city": "3915",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mannargudi",
        "id_city": "3938",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Maraimalai Nagar",
        "id_city": "3940",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melamadai",
        "id_city": "3955",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mettupalayam",
        "id_city": "3964",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Neykkarappatti",
        "id_city": "4037",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sumerpur",
        "id_city": "3519",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Jorethang",
        "id_city": "3542",
        "state_name": "Sikkim"
      },
      {
        "city_name": "Abiramam",
        "id_city": "3551",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ambasamudram",
        "id_city": "3577",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Annur",
        "id_city": "3594",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arakonam",
        "id_city": "3599",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Arcot",
        "id_city": "3607",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ariyur",
        "id_city": "3611",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ayyalur",
        "id_city": "3636",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Azhagiapandiapuram",
        "id_city": "3639",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Balakrishnampatti",
        "id_city": "3640",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Balapallam",
        "id_city": "3642",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chettiarpatti",
        "id_city": "3665",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Chettithangal",
        "id_city": "3668",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Devadanapatti",
        "id_city": "3691",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Devanangurichi",
        "id_city": "3694",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Erode",
        "id_city": "3714",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gopichettipalaiyam",
        "id_city": "3728",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Highways",
        "id_city": "3736",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalinjur",
        "id_city": "3767",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kambainallur",
        "id_city": "3777",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kandanur",
        "id_city": "3784",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kangeyanallur",
        "id_city": "3787",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kannamangalam",
        "id_city": "3791",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kannapalaiyam",
        "id_city": "3794",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karambakkudi",
        "id_city": "3801",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Killlai",
        "id_city": "3836",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kmarasamipatti",
        "id_city": "3844",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kodambakkam",
        "id_city": "3847",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Lalgudi",
        "id_city": "3902",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mandaikadu",
        "id_city": "3932",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melmananbedu",
        "id_city": "3960",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mukkudal",
        "id_city": "3978",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nadukkuthagai",
        "id_city": "3992",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nallampatti",
        "id_city": "3998",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nallur",
        "id_city": "3999",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Narasimhanaickenpalayam",
        "id_city": "4013",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nattapettai",
        "id_city": "4022",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nazerath",
        "id_city": "4026",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nerkunram",
        "id_city": "4034",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Todra",
        "id_city": "3530",
        "state_name": "Rajasthan"
      },
      {
        "city_name": "Arni",
        "id_city": "3612",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Athani",
        "id_city": "3619",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ayothiapattinam",
        "id_city": "3635",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ayyampettai",
        "id_city": "3638",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Dalavaipatti",
        "id_city": "3687",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Denkanikottai",
        "id_city": "3689",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Elayirampannai",
        "id_city": "3709",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Gandhi Nagar",
        "id_city": "3722",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Guduvanchery",
        "id_city": "3731",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Hubbathala",
        "id_city": "3738",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalambur",
        "id_city": "3763",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kalapatti",
        "id_city": "3764",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Karunguzhi",
        "id_city": "3809",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kodavasal",
        "id_city": "3848",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kollankoil",
        "id_city": "3855",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Komaralingam",
        "id_city": "3856",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kondalampatti",
        "id_city": "3861",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kunnathur",
        "id_city": "3888",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kurichi",
        "id_city": "3891",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kuttanallur",
        "id_city": "3898",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Lalpet",
        "id_city": "3903",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Madukkur",
        "id_city": "3911",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mangadu",
        "id_city": "3934",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Melacheval",
        "id_city": "3952",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Minambakkam",
        "id_city": "3969",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mulakaraipatti",
        "id_city": "3980",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nagapattinam",
        "id_city": "3994",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Neripperichal",
        "id_city": "4033",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Nilakkottai",
        "id_city": "4041",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Panboli",
        "id_city": "4086",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Papanasam",
        "id_city": "4092",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pattinam",
        "id_city": "4103",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Periyapatti",
        "id_city": "4119",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pernambut",
        "id_city": "4121",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perumandi",
        "id_city": "4123",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sankarankoil",
        "id_city": "4188",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Shencottai",
        "id_city": "4212",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sivagiri",
        "id_city": "4229",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sundarapandiam",
        "id_city": "4245",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirumangalam",
        "id_city": "4320",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirumuruganpundi",
        "id_city": "4322",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruppuvanam",
        "id_city": "4327",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uthiramerur",
        "id_city": "4359",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uttamapalaiyam",
        "id_city": "4361",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vandavasi",
        "id_city": "4380",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vattalkundu",
        "id_city": "4388",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Viravanallur",
        "id_city": "4430",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Devarkonda",
        "id_city": "4455",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kottagudem",
        "id_city": "4470",
        "state_name": "Telangana"
      },
      {
        "city_name": "Agartala",
        "id_city": "4508",
        "state_name": "Tripura"
      },
      {
        "city_name": "Nilankarai",
        "id_city": "4042",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Odaipatti",
        "id_city": "4043",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Oddanchatram",
        "id_city": "4045",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palakkodu",
        "id_city": "4063",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pannuratti",
        "id_city": "4090",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pattiviranpatti",
        "id_city": "4104",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pothatturpettai",
        "id_city": "4144",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudukadai",
        "id_city": "4145",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Rajapalayam",
        "id_city": "4170",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ramapuram",
        "id_city": "4172",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sambavar Vadagarai",
        "id_city": "4186",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sayalgudi",
        "id_city": "4199",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Senthamangalam",
        "id_city": "4205",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sivur",
        "id_city": "4232",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Suliswaranpatti",
        "id_city": "4243",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tattayyangarpettai",
        "id_city": "4254",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruvethipuram",
        "id_city": "4335",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Udumalpet",
        "id_city": "4347",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ullur",
        "id_city": "4348",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uppiliapuram",
        "id_city": "4353",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uttukkuli",
        "id_city": "4362",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Valasaravakkam",
        "id_city": "4373",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Valavanur",
        "id_city": "4374",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vaniyambadi",
        "id_city": "4383",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vasudevanallur",
        "id_city": "4386",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellimalai",
        "id_city": "4400",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vilavur",
        "id_city": "4421",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virapandi Cantonment",
        "id_city": "4428",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Wellington",
        "id_city": "4439",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ghatkesar",
        "id_city": "4459",
        "state_name": "Telangana"
      },
      {
        "city_name": "Koratla",
        "id_city": "4469",
        "state_name": "Telangana"
      },
      {
        "city_name": "Peddapalli",
        "id_city": "4489",
        "state_name": "Telangana"
      },
      {
        "city_name": "Teliamura",
        "id_city": "4529",
        "state_name": "Tripura"
      },
      {
        "city_name": "Othakadai",
        "id_city": "4052",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Padririvedu",
        "id_city": "4060",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallapatti",
        "id_city": "4074",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallikonda",
        "id_city": "4078",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Periyasemur",
        "id_city": "4120",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Putteri",
        "id_city": "4166",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sattankulam",
        "id_city": "4197",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sevugampatti",
        "id_city": "4210",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sirugamani",
        "id_city": "4224",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sivaganga",
        "id_city": "4228",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sulur",
        "id_city": "4244",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Theni Allinagaram",
        "id_city": "4270",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirunirmalai",
        "id_city": "4288",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruvennainallur",
        "id_city": "4301",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thuthipattu",
        "id_city": "4310",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirunelveli",
        "id_city": "4324",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ulundurpettai",
        "id_city": "4349",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Walajapet",
        "id_city": "4438",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Yercaud",
        "id_city": "4440",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bhadrachalam",
        "id_city": "4449",
        "state_name": "Telangana"
      },
      {
        "city_name": "Gadwal",
        "id_city": "4457",
        "state_name": "Telangana"
      },
      {
        "city_name": "Gajwel",
        "id_city": "4458",
        "state_name": "Telangana"
      },
      {
        "city_name": "Jangaon",
        "id_city": "4462",
        "state_name": "Telangana"
      },
      {
        "city_name": "Mandamarri",
        "id_city": "4476",
        "state_name": "Telangana"
      },
      {
        "city_name": "Medak",
        "id_city": "4478",
        "state_name": "Telangana"
      },
      {
        "city_name": "Sarapaka",
        "id_city": "4494",
        "state_name": "Telangana"
      },
      {
        "city_name": "Sathupalle",
        "id_city": "4495",
        "state_name": "Telangana"
      },
      {
        "city_name": "Warangal",
        "id_city": "4505",
        "state_name": "Telangana"
      },
      {
        "city_name": "Yellandu",
        "id_city": "4506",
        "state_name": "Telangana"
      },
      {
        "city_name": "Khowai",
        "id_city": "4521",
        "state_name": "Tripura"
      },
      {
        "city_name": "Pratapgarh",
        "id_city": "4525",
        "state_name": "Tripura"
      },
      {
        "city_name": "Panagudi",
        "id_city": "4083",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Paravai",
        "id_city": "4100",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pasur",
        "id_city": "4101",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ponnamaravathi",
        "id_city": "4139",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puliyur",
        "id_city": "4158",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Punjai Thottakurichi",
        "id_city": "4163",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Rayagiri",
        "id_city": "4176",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sholavandan",
        "id_city": "4214",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Srirangam",
        "id_city": "4239",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Suriyampalayam",
        "id_city": "4249",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Taramangalam",
        "id_city": "4253",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tenkasi",
        "id_city": "4256",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thottipalayam",
        "id_city": "4307",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thuvakudi",
        "id_city": "4311",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tindivanam",
        "id_city": "4313",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirukkattuppalli",
        "id_city": "4318",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirumullaivasal",
        "id_city": "4321",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirusulam",
        "id_city": "4329",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Velampalaiyam",
        "id_city": "4393",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Villukuri",
        "id_city": "4422",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Villupuram",
        "id_city": "4423",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virudhunagar",
        "id_city": "4433",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bollaram",
        "id_city": "4454",
        "state_name": "Telangana"
      },
      {
        "city_name": "Karimnagar",
        "id_city": "4466",
        "state_name": "Telangana"
      },
      {
        "city_name": "Nalgonda",
        "id_city": "4483",
        "state_name": "Telangana"
      },
      {
        "city_name": "Narayanpet",
        "id_city": "4484",
        "state_name": "Telangana"
      },
      {
        "city_name": "Sircilla",
        "id_city": "4499",
        "state_name": "Telangana"
      },
      {
        "city_name": "Sonamura",
        "id_city": "4528",
        "state_name": "Tripura"
      },
      {
        "city_name": "Udaipur",
        "id_city": "4530",
        "state_name": "Tripura"
      },
      {
        "city_name": "Ooty",
        "id_city": "4050",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Padaividu",
        "id_city": "4056",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palayamkottai",
        "id_city": "4071",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palladam",
        "id_city": "4072",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pennathur",
        "id_city": "4109",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Peralam",
        "id_city": "4111",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Periyanayakkanpalaiyam",
        "id_city": "4117",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Porur",
        "id_city": "4142",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pothanur",
        "id_city": "4143",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Samalapuram",
        "id_city": "4184",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Samathur",
        "id_city": "4185",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sennirkuppam",
        "id_city": "4204",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tambaram",
        "id_city": "4252",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruthangal",
        "id_city": "4294",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruthuraipundi",
        "id_city": "4295",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tinnanur",
        "id_city": "4314",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirukkoyilur",
        "id_city": "4319",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruvidaimarudur",
        "id_city": "4336",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadamadurai",
        "id_city": "4367",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vaithiswarankoil",
        "id_city": "4371",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vanavasi",
        "id_city": "4378",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vandalur",
        "id_city": "4379",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Varadharajapuram",
        "id_city": "4385",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellakoil",
        "id_city": "4396",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vilathikulam",
        "id_city": "4420",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virudhachalam",
        "id_city": "4432",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Zamin Uthukuli",
        "id_city": "4441",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Farooqnagar",
        "id_city": "4456",
        "state_name": "Telangana"
      },
      {
        "city_name": "Nirmal",
        "id_city": "4486",
        "state_name": "Telangana"
      },
      {
        "city_name": "Nizamabad",
        "id_city": "4487",
        "state_name": "Telangana"
      },
      {
        "city_name": "Singapur",
        "id_city": "4498",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kailasahar",
        "id_city": "4518",
        "state_name": "Tripura"
      },
      {
        "city_name": "Othakalmandapam",
        "id_city": "4053",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pappireddipatti",
        "id_city": "4095",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pazhugal",
        "id_city": "4106",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudupalaiyam Aghraharam",
        "id_city": "4148",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pulampatti",
        "id_city": "4155",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puliyankudi",
        "id_city": "4157",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ramanathapuram",
        "id_city": "4171",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Salem",
        "id_city": "4183",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sankarapuram",
        "id_city": "4189",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sathyamangalam",
        "id_city": "4196",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Shenkottai",
        "id_city": "4213",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sirkali",
        "id_city": "4223",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sithurajapuram",
        "id_city": "4227",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Srivilliputtur",
        "id_city": "4241",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thanjavur",
        "id_city": "4263",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruppanandal",
        "id_city": "4292",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruchengode",
        "id_city": "4316",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Udagamandalam",
        "id_city": "4342",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Udayarpalayam",
        "id_city": "4345",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadavalli",
        "id_city": "4368",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vengavasal",
        "id_city": "4406",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Veppathur",
        "id_city": "4410",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Walajabad",
        "id_city": "4437",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Mahbubnagar",
        "id_city": "4474",
        "state_name": "Telangana"
      },
      {
        "city_name": "Medchal",
        "id_city": "4479",
        "state_name": "Telangana"
      },
      {
        "city_name": "Narsampet",
        "id_city": "4485",
        "state_name": "Telangana"
      },
      {
        "city_name": "Ranga Reddy district",
        "id_city": "4491",
        "state_name": "Telangana"
      },
      {
        "city_name": "Wanaparthy",
        "id_city": "4504",
        "state_name": "Telangana"
      },
      {
        "city_name": "Belonia",
        "id_city": "4512",
        "state_name": "Tripura"
      },
      {
        "city_name": "Agra",
        "id_city": "4536",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pacode",
        "id_city": "4055",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palaganangudy",
        "id_city": "4061",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palaimpatti",
        "id_city": "4062",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palavakkam",
        "id_city": "4067",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pammal",
        "id_city": "4082",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Panapakkam",
        "id_city": "4085",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Peranamallur",
        "id_city": "4113",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Periyakodiveri",
        "id_city": "4115",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Periyakulam",
        "id_city": "4116",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perungalathur",
        "id_city": "4126",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudur",
        "id_city": "4152",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Salangapalayam",
        "id_city": "4182",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sankarnagar",
        "id_city": "4191",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "South Kodikulam",
        "id_city": "4235",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sriperumpudur",
        "id_city": "4237",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "TNPL Pugalur",
        "id_city": "4251",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thenkarai",
        "id_city": "4271",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirukazhukundram",
        "id_city": "4282",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruporur",
        "id_city": "4291",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thisayanvilai",
        "id_city": "4303",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirukkalukkundram",
        "id_city": "4317",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirunageswaram",
        "id_city": "4323",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirupathur",
        "id_city": "4325",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirupur",
        "id_city": "4328",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uppidamangalam",
        "id_city": "4352",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Urapakkam",
        "id_city": "4355",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Usilampatti",
        "id_city": "4356",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadalur",
        "id_city": "4366",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vaniputhur",
        "id_city": "4382",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Venghatur",
        "id_city": "4407",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vettavalam",
        "id_city": "4413",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virapandi",
        "id_city": "4427",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bhupalpally",
        "id_city": "4452",
        "state_name": "Telangana"
      },
      {
        "city_name": "Sangareddy",
        "id_city": "4493",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kanchanpur",
        "id_city": "4520",
        "state_name": "Tripura"
      },
      {
        "city_name": "Ailum",
        "id_city": "4539",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Air Force Area",
        "id_city": "4540",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Palayakayal",
        "id_city": "4069",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Panaimarathupatti",
        "id_city": "4084",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pappankurichi",
        "id_city": "4093",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Polichalur",
        "id_city": "4135",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudupattinam",
        "id_city": "4151",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puduvayal",
        "id_city": "4153",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puvalur",
        "id_city": "4167",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Semmipalayam",
        "id_city": "4203",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Singampuneri",
        "id_city": "4219",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thakkolam",
        "id_city": "4258",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruparankundram",
        "id_city": "4289",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thorapadi",
        "id_city": "4306",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Timiri",
        "id_city": "4312",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tittakudi",
        "id_city": "4338",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uthayendram",
        "id_city": "4358",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vathirairuppu",
        "id_city": "4387",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vedasandur",
        "id_city": "4392",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Velankanni",
        "id_city": "4394",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virupakshipuram",
        "id_city": "4434",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Kamareddy",
        "id_city": "4465",
        "state_name": "Telangana"
      },
      {
        "city_name": "Orathanadu",
        "id_city": "4051",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palamedu",
        "id_city": "4064",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallipattu",
        "id_city": "4081",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pattukkottai",
        "id_city": "4105",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perumuchi",
        "id_city": "4124",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pulambadi",
        "id_city": "4154",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Punamalli",
        "id_city": "4161",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sadayankuppam",
        "id_city": "4180",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sankari",
        "id_city": "4190",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sathuvachari",
        "id_city": "4195",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sattur",
        "id_city": "4198",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sayapuram",
        "id_city": "4200",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sholur",
        "id_city": "4217",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Soranjeri",
        "id_city": "4233",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "South Kannanur",
        "id_city": "4234",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Srimushnam",
        "id_city": "4236",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thalainayar",
        "id_city": "4259",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thalakudi",
        "id_city": "4260",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thammampatti",
        "id_city": "4262",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tharangambadi",
        "id_city": "4265",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruvattaru",
        "id_city": "4299",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruchchendur",
        "id_city": "4315",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tirupattur",
        "id_city": "4326",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruvottiyur",
        "id_city": "4337",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tuticorin",
        "id_city": "4341",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Urachikkottai",
        "id_city": "4354",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vallam",
        "id_city": "4375",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Varadarajanpettai",
        "id_city": "4384",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vikramasingapuram",
        "id_city": "4415",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Adilabad",
        "id_city": "4443",
        "state_name": "Telangana"
      },
      {
        "city_name": "Armoor",
        "id_city": "4444",
        "state_name": "Telangana"
      },
      {
        "city_name": "Hyderabad",
        "id_city": "4460",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kalwakurthy",
        "id_city": "4464",
        "state_name": "Telangana"
      },
      {
        "city_name": "Mahabubabad",
        "id_city": "4473",
        "state_name": "Telangana"
      },
      {
        "city_name": "Vikarabad",
        "id_city": "4503",
        "state_name": "Telangana"
      },
      {
        "city_name": "Gakulnagar",
        "id_city": "4514",
        "state_name": "Tripura"
      },
      {
        "city_name": "Achhnera",
        "id_city": "4532",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Agra Cantonment",
        "id_city": "4537",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Odugathur",
        "id_city": "4046",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Padianallur",
        "id_city": "4057",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pannaikadu",
        "id_city": "4088",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Panruti",
        "id_city": "4091",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Papparapatti",
        "id_city": "4094",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perambalur",
        "id_city": "4112",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perumagalur",
        "id_city": "4122",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pillanallur",
        "id_city": "4133",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Polur",
        "id_city": "4137",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudukkottai Cantonment",
        "id_city": "4146",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puluvapatti",
        "id_city": "4160",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Rudravathi",
        "id_city": "4179",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sarcarsamakulam",
        "id_city": "4193",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sembakkam",
        "id_city": "4202",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sentharapatti",
        "id_city": "4206",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sikkarayapuram",
        "id_city": "4218",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Singaperumalkoil",
        "id_city": "4221",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sirumugai",
        "id_city": "4225",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sithayankottai",
        "id_city": "4226",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sriramapuram",
        "id_city": "4238",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thadikombu",
        "id_city": "4257",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thenambakkam",
        "id_city": "4267",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thesur",
        "id_city": "4274",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruvenkatam",
        "id_city": "4300",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thottiyam",
        "id_city": "4308",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Udankudi",
        "id_city": "4344",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uthangarai",
        "id_city": "4357",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadakarai Kizhpadugai",
        "id_city": "4363",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Valangaiman",
        "id_city": "4372",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vandiyur",
        "id_city": "4381",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vedaranniyam",
        "id_city": "4391",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Verkilambi",
        "id_city": "4411",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Viraganur",
        "id_city": "4424",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Asifabad",
        "id_city": "4445",
        "state_name": "Telangana"
      },
      {
        "city_name": "Badepally",
        "id_city": "4446",
        "state_name": "Telangana"
      },
      {
        "city_name": "Bhainsa",
        "id_city": "4450",
        "state_name": "Telangana"
      },
      {
        "city_name": "Khammam",
        "id_city": "4467",
        "state_name": "Telangana"
      },
      {
        "city_name": "Zahirabad",
        "id_city": "4507",
        "state_name": "Telangana"
      },
      {
        "city_name": "Dharmanagar",
        "id_city": "4513",
        "state_name": "Tripura"
      },
      {
        "city_name": "Sabrum",
        "id_city": "4527",
        "state_name": "Tripura"
      },
      {
        "city_name": "Odaiyakulam",
        "id_city": "4044",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Padirikuppam",
        "id_city": "4058",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Padmanabhapuram",
        "id_city": "4059",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallapalayam",
        "id_city": "4073",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pandamangalam",
        "id_city": "4087",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Paramankurichi",
        "id_city": "4097",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perur",
        "id_city": "4129",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Rithapuram",
        "id_city": "4177",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Rosalpatti",
        "id_city": "4178",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sethiathoppu",
        "id_city": "4208",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sevilimedu",
        "id_city": "4209",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Singanallur",
        "id_city": "4220",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Srivaikuntam",
        "id_city": "4240",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirukarungudi",
        "id_city": "4281",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thudiyalur",
        "id_city": "4309",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Uthukkottai",
        "id_city": "4360",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vazhapadi",
        "id_city": "4389",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellalur",
        "id_city": "4398",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Venkarai",
        "id_city": "4408",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vijayapuri",
        "id_city": "4414",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vilankurichi",
        "id_city": "4418",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virakkalpudur",
        "id_city": "4426",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Viswanatham",
        "id_city": "4435",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Banswada",
        "id_city": "4447",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kodada",
        "id_city": "4468",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kyathampalle",
        "id_city": "4471",
        "state_name": "Telangana"
      },
      {
        "city_name": "Nakrekal",
        "id_city": "4482",
        "state_name": "Telangana"
      },
      {
        "city_name": "Ramagundam",
        "id_city": "4490",
        "state_name": "Telangana"
      },
      {
        "city_name": "Secunderabad",
        "id_city": "4496",
        "state_name": "Telangana"
      },
      {
        "city_name": "Gandhigram",
        "id_city": "4515",
        "state_name": "Tripura"
      },
      {
        "city_name": "Ottapparai",
        "id_city": "4054",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palayam",
        "id_city": "4070",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallavaram",
        "id_city": "4076",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Periyanegamam",
        "id_city": "4118",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perundurai",
        "id_city": "4125",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pethampalayam",
        "id_city": "4131",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pethanaickenpalayam",
        "id_city": "4132",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Rameswaram",
        "id_city": "4173",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Seithur",
        "id_city": "4201",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sivanthipuram",
        "id_city": "4231",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Suchindram",
        "id_city": "4242",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Surampatti",
        "id_city": "4247",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Theni",
        "id_city": "4269",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thenthiruperai",
        "id_city": "4273",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thingalnagar",
        "id_city": "4279",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirunindravur",
        "id_city": "4287",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruvithankodu",
        "id_city": "4302",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thittacheri",
        "id_city": "4304",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Udagamandalam Valley",
        "id_city": "4343",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Valvaithankoshtam",
        "id_city": "4377",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Velluru",
        "id_city": "4403",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vilapakkam",
        "id_city": "4419",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virappanchatram",
        "id_city": "4429",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virudambattu",
        "id_city": "4431",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vriddhachalam",
        "id_city": "4436",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Achampet",
        "id_city": "4442",
        "state_name": "Telangana"
      },
      {
        "city_name": "Bellampalli",
        "id_city": "4448",
        "state_name": "Telangana"
      },
      {
        "city_name": "Jagtial",
        "id_city": "4461",
        "state_name": "Telangana"
      },
      {
        "city_name": "Siddipet",
        "id_city": "4497",
        "state_name": "Telangana"
      },
      {
        "city_name": "Vemulawada",
        "id_city": "4502",
        "state_name": "Telangana"
      },
      {
        "city_name": "Badharghat",
        "id_city": "4511",
        "state_name": "Tripura"
      },
      {
        "city_name": "Olagadam",
        "id_city": "4048",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallikaranai",
        "id_city": "4077",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pannaipuram",
        "id_city": "4089",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Paramakkudi",
        "id_city": "4096",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Paramathi",
        "id_city": "4098",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Parangippettai",
        "id_city": "4099",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pathamadai",
        "id_city": "4102",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perungulam",
        "id_city": "4128",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perur Chettipalaiyam",
        "id_city": "4130",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudukottai",
        "id_city": "4147",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudupatti",
        "id_city": "4150",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pullampadi",
        "id_city": "4159",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Punjai Puliyampatti",
        "id_city": "4162",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puzhithivakkam",
        "id_city": "4169",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Saint Thomas Mount",
        "id_city": "4181",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Saravanampatti",
        "id_city": "4192",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sathiyavijayanagaram",
        "id_city": "4194",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Senur",
        "id_city": "4207",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sundarapandiapuram",
        "id_city": "4246",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Swamimalai",
        "id_city": "4250",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thanthoni",
        "id_city": "4264",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thevaram",
        "id_city": "4275",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiagadurgam",
        "id_city": "4277",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirumalayampalayam",
        "id_city": "4283",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirupuvanam",
        "id_city": "4293",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruvallur",
        "id_city": "4331",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruverambur",
        "id_city": "4333",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruverkadu",
        "id_city": "4334",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Unjalaur",
        "id_city": "4350",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadakku Valliyur",
        "id_city": "4365",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadugapatti",
        "id_city": "4370",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vedapatti",
        "id_city": "4390",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vennanthur",
        "id_city": "4409",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vettaikaranpudur",
        "id_city": "4412",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palwancha",
        "id_city": "4488",
        "state_name": "Telangana"
      },
      {
        "city_name": "Indranagar",
        "id_city": "4516",
        "state_name": "Tripura"
      },
      {
        "city_name": "Kamalpur",
        "id_city": "4519",
        "state_name": "Tripura"
      },
      {
        "city_name": "Narsingarh",
        "id_city": "4524",
        "state_name": "Tripura"
      },
      {
        "city_name": "Achhalda",
        "id_city": "4531",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Palavansathu",
        "id_city": "4068",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Peraiyur",
        "id_city": "4110",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pirkankaranai",
        "id_city": "4134",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puzhal",
        "id_city": "4168",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Rasipuram",
        "id_city": "4175",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sholinganallur",
        "id_city": "4215",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sirapalli",
        "id_city": "4222",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thedavur",
        "id_city": "4266",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiagarajar Colony",
        "id_city": "4278",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirunagar",
        "id_city": "4285",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirunageswaram",
        "id_city": "4286",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruttani",
        "id_city": "4330",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Turaiyur",
        "id_city": "4340",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Udumalaipettai",
        "id_city": "4346",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadipatti",
        "id_city": "4369",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Valparai",
        "id_city": "4376",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellakinar",
        "id_city": "4395",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellottamparappu",
        "id_city": "4402",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vengampudur",
        "id_city": "4404",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vikravandi",
        "id_city": "4416",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vilangudi",
        "id_city": "4417",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Virakeralam",
        "id_city": "4425",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bhongir",
        "id_city": "4451",
        "state_name": "Telangana"
      },
      {
        "city_name": "Manuguru",
        "id_city": "4477",
        "state_name": "Telangana"
      },
      {
        "city_name": "Miryalaguda",
        "id_city": "4480",
        "state_name": "Telangana"
      },
      {
        "city_name": "Amarpur",
        "id_city": "4509",
        "state_name": "Tripura"
      },
      {
        "city_name": "Jogendranagar",
        "id_city": "4517",
        "state_name": "Tripura"
      },
      {
        "city_name": "Oggiyamduraipakkam",
        "id_city": "4047",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palani Chettipatti",
        "id_city": "4066",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Peravurani",
        "id_city": "4114",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Perungudi",
        "id_city": "4127",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ponmani",
        "id_city": "4138",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ponnampatti",
        "id_city": "4140",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ponneri",
        "id_city": "4141",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pudupalayam",
        "id_city": "4149",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puliyampatti",
        "id_city": "4156",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Ranipet",
        "id_city": "4174",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sholingur",
        "id_city": "4216",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Surandai",
        "id_city": "4248",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tayilupatti",
        "id_city": "4255",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thamaraikulam",
        "id_city": "4261",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thengampudur",
        "id_city": "4268",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thevur",
        "id_city": "4276",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thirumazhisai",
        "id_city": "4284",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruparappu",
        "id_city": "4290",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruvarur",
        "id_city": "4298",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tondi",
        "id_city": "4339",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellalapatti",
        "id_city": "4397",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellanur",
        "id_city": "4399",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vellore",
        "id_city": "4401",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Suryapet",
        "id_city": "4500",
        "state_name": "Telangana"
      },
      {
        "city_name": "Ambassa",
        "id_city": "4510",
        "state_name": "Tripura"
      },
      {
        "city_name": "Adari",
        "id_city": "4533",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Afzalgarh",
        "id_city": "4534",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Omalur",
        "id_city": "4049",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Palani",
        "id_city": "4065",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallattur",
        "id_city": "4075",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallipalaiyam",
        "id_city": "4079",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pallipalaiyam Agraharam",
        "id_city": "4080",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pennadam",
        "id_city": "4107",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pennagaram",
        "id_city": "4108",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Pollachi",
        "id_city": "4136",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Punjaipugalur",
        "id_city": "4164",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Puthalam",
        "id_city": "4165",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sankaramanallur",
        "id_city": "4187",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Shenbakkam",
        "id_city": "4211",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Sivakasi",
        "id_city": "4230",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thenthamaraikulam",
        "id_city": "4272",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruchirapalli",
        "id_city": "4280",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruvaivaru",
        "id_city": "4296",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thiruvalam",
        "id_city": "4297",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Thondamuthur",
        "id_city": "4305",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Tiruvannamalai",
        "id_city": "4332",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Unnamalaikadai",
        "id_city": "4351",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vadakkanandal",
        "id_city": "4364",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Vengathur",
        "id_city": "4405",
        "state_name": "Tamil Nadu"
      },
      {
        "city_name": "Bodhan",
        "id_city": "4453",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kagaznagar",
        "id_city": "4463",
        "state_name": "Telangana"
      },
      {
        "city_name": "Madhira",
        "id_city": "4472",
        "state_name": "Telangana"
      },
      {
        "city_name": "Mancherial",
        "id_city": "4475",
        "state_name": "Telangana"
      },
      {
        "city_name": "Nagar Karnul",
        "id_city": "4481",
        "state_name": "Telangana"
      },
      {
        "city_name": "Sadasivpet",
        "id_city": "4492",
        "state_name": "Telangana"
      },
      {
        "city_name": "Tandur",
        "id_city": "4501",
        "state_name": "Telangana"
      },
      {
        "city_name": "Kumarghat",
        "id_city": "4522",
        "state_name": "Tripura"
      },
      {
        "city_name": "Kunjaban",
        "id_city": "4523",
        "state_name": "Tripura"
      },
      {
        "city_name": "Ranir Bazar",
        "id_city": "4526",
        "state_name": "Tripura"
      },
      {
        "city_name": "Agarwal Mandi",
        "id_city": "4535",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ahraura",
        "id_city": "4538",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Auras",
        "id_city": "4573",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhulepur",
        "id_city": "4645",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bighapur",
        "id_city": "4647",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilsanda",
        "id_city": "4657",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bisharatganj",
        "id_city": "4663",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chakia",
        "id_city": "4674",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dalmau",
        "id_city": "4698",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dibai",
        "id_city": "4716",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fatehgarh",
        "id_city": "4741",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghatampur",
        "id_city": "4758",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghughuli",
        "id_city": "4765",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Haidergarh",
        "id_city": "4785",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Haldaur",
        "id_city": "4786",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hardoi",
        "id_city": "4790",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Harduaganj",
        "id_city": "4791",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hyderabad",
        "id_city": "4800",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jiyanpur",
        "id_city": "4837",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kannauj",
        "id_city": "4860",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khamaria",
        "id_city": "4885",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khutar",
        "id_city": "4898",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lohta",
        "id_city": "4931",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Loni",
        "id_city": "4932",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Modinagar",
        "id_city": "4981",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Moradabad",
        "id_city": "4986",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Najibabad",
        "id_city": "5005",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Aligarh",
        "id_city": "4545",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Baghpat",
        "id_city": "4588",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Banat",
        "id_city": "4602",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Baraut",
        "id_city": "4611",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Begumabad Budhana",
        "id_city": "4622",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhinga",
        "id_city": "4641",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhongaon",
        "id_city": "4644",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Charkhari",
        "id_city": "4678",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Deoranian",
        "id_city": "4706",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dhampur",
        "id_city": "4709",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gosainganj",
        "id_city": "4774",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hariharpur",
        "id_city": "4793",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jahanabad",
        "id_city": "4810",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jaithara",
        "id_city": "4814",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Karari",
        "id_city": "4866",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khadda",
        "id_city": "4878",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khair",
        "id_city": "4881",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kurara",
        "id_city": "4917",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kurthi Jafarpur",
        "id_city": "4920",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lakhna",
        "id_city": "4925",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lucknow",
        "id_city": "4933",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mataundh",
        "id_city": "4960",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nagina",
        "id_city": "5001",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pachperwa",
        "id_city": "5032",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Amraudha",
        "id_city": "4556",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Anandnagar",
        "id_city": "4558",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Aurangabad",
        "id_city": "4571",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Aurangabad Bangar",
        "id_city": "4572",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bah",
        "id_city": "4589",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bakiabad",
        "id_city": "4598",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barabanki",
        "id_city": "4609",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bugrasi",
        "id_city": "4668",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dhanaura",
        "id_city": "4712",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dohrighat",
        "id_city": "4720",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dostpur",
        "id_city": "4721",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fatehpur Chaurasi",
        "id_city": "4743",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fatehpur Sikri",
        "id_city": "4744",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gajraula",
        "id_city": "4746",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gawan",
        "id_city": "4757",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghaziabad",
        "id_city": "4759",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghazipur",
        "id_city": "4760",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gopamau",
        "id_city": "4771",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Greater Noida",
        "id_city": "4776",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hasanpur",
        "id_city": "4795",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jalaun",
        "id_city": "4818",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jasrana",
        "id_city": "4824",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kachhwa",
        "id_city": "4844",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kant",
        "id_city": "4862",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khailar",
        "id_city": "4880",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kharela",
        "id_city": "4887",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Koiripur",
        "id_city": "4904",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kotwa",
        "id_city": "4912",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kurawali",
        "id_city": "4918",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Laharpur",
        "id_city": "4923",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ledwa Mahuwa",
        "id_city": "4930",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Machhlishahr",
        "id_city": "4934",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mahaban",
        "id_city": "4938",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maharajganj",
        "id_city": "4939",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mainpuri",
        "id_city": "4946",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mathu",
        "id_city": "4961",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mirat",
        "id_city": "4976",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Misrikh",
        "id_city": "4980",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mohan",
        "id_city": "4983",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Naugawan Sadat",
        "id_city": "5013",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nindaura",
        "id_city": "5019",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Noida",
        "id_city": "5022",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Northern Railway Colony",
        "id_city": "5023",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Padrauna",
        "id_city": "5033",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Babrala",
        "id_city": "4582",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Baldeo",
        "id_city": "4599",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Banda",
        "id_city": "4603",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bansdih",
        "id_city": "4606",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Behat",
        "id_city": "4623",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Belthara",
        "id_city": "4626",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhatni Bazar",
        "id_city": "4638",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilram",
        "id_city": "4655",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bisalpur",
        "id_city": "4660",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chail",
        "id_city": "4671",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Charthawal",
        "id_city": "4679",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chaumuhan",
        "id_city": "4680",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chitrakut Dham",
        "id_city": "4691",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Deoria",
        "id_city": "4707",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dhanauha",
        "id_city": "4710",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fatehganj Pashchimi",
        "id_city": "4739",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fatehpur",
        "id_city": "4742",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ganj Muradabad",
        "id_city": "4750",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gola Bazar",
        "id_city": "4768",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hapur",
        "id_city": "4789",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jyoti Khuria",
        "id_city": "4839",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kakod",
        "id_city": "4851",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khariya",
        "id_city": "4889",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kishanpur",
        "id_city": "4901",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kishni",
        "id_city": "4902",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kopaganj",
        "id_city": "4906",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mahoba",
        "id_city": "4941",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mankapur",
        "id_city": "4955",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mawana",
        "id_city": "4969",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Miranpur",
        "id_city": "4975",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Moth",
        "id_city": "4987",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pali",
        "id_city": "5036",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Aliganj",
        "id_city": "4544",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Amilo",
        "id_city": "4553",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Antu",
        "id_city": "4560",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ashokpuram",
        "id_city": "4564",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Badaun",
        "id_city": "4587",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bahsuma",
        "id_city": "4594",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bansgaon",
        "id_city": "4607",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barwar",
        "id_city": "4620",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bisanda Buzurg",
        "id_city": "4661",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chit Baragaon",
        "id_city": "4690",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dataganj",
        "id_city": "4702",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dhauratanda",
        "id_city": "4714",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Do Ghat",
        "id_city": "4719",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Faridnagar",
        "id_city": "4733",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gonda",
        "id_city": "4770",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ibrahimpur",
        "id_city": "4801",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jais",
        "id_city": "4813",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jamshila",
        "id_city": "4820",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhalu",
        "id_city": "4829",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhinjhana",
        "id_city": "4834",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kalpi",
        "id_city": "4855",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kithaur",
        "id_city": "4903",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kota",
        "id_city": "4910",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kulpahar",
        "id_city": "4913",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lakhimpur",
        "id_city": "4924",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lalganj",
        "id_city": "4926",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mathura Cantonment",
        "id_city": "4963",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mughal Sarai",
        "id_city": "4989",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Atrauli",
        "id_city": "4568",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Babarpur Ajitmal",
        "id_city": "4579",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barhapur",
        "id_city": "4616",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barsana",
        "id_city": "4618",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhargain",
        "id_city": "4634",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bijpur",
        "id_city": "4649",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chharprauli",
        "id_city": "4683",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chilkana Sultanpur",
        "id_city": "4688",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chirgaon",
        "id_city": "4689",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chunar",
        "id_city": "4694",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dewa",
        "id_city": "4708",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dudhinagar",
        "id_city": "4722",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Etawah",
        "id_city": "4728",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gausganj",
        "id_city": "4756",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gohand",
        "id_city": "4766",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gola Gokarannath",
        "id_city": "4769",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Govardhan",
        "id_city": "4775",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hargaon",
        "id_city": "4792",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ikauna",
        "id_city": "4803",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Indian Telephone Industry Mank",
        "id_city": "4805",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jahangirpur",
        "id_city": "4812",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jaunpur",
        "id_city": "4827",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kamalganj",
        "id_city": "4856",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Katariya",
        "id_city": "4870",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kathera",
        "id_city": "4872",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khargupur",
        "id_city": "4888",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mailani",
        "id_city": "4945",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mariahu",
        "id_city": "4957",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mau Aima",
        "id_city": "4965",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maudaha",
        "id_city": "4966",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Meerut",
        "id_city": "4970",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mirganj",
        "id_city": "4978",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mughal Sarai Railway Settlemen",
        "id_city": "4990",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Naraini",
        "id_city": "5010",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nawabganj",
        "id_city": "5015",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nihtaur",
        "id_city": "5018",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Orai",
        "id_city": "5029",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pahasu",
        "id_city": "5034",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Parichhatgarh",
        "id_city": "5040",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Azamgarh",
        "id_city": "4576",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bahraich",
        "id_city": "4593",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Balrampur",
        "id_city": "4601",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barhalganj",
        "id_city": "4614",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhadarsa",
        "id_city": "4630",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhawan Bahadurnagar",
        "id_city": "4640",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhokarhedi",
        "id_city": "4643",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilgram",
        "id_city": "4653",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilhaur",
        "id_city": "4654",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Budaun",
        "id_city": "4667",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chandauli",
        "id_city": "4675",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chandausi",
        "id_city": "4676",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chhara Rafatpur",
        "id_city": "4682",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dhanauli",
        "id_city": "4711",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dildarnagar Fatehpur",
        "id_city": "4718",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Farrukhabad",
        "id_city": "4737",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Garhi Pukhta",
        "id_city": "4752",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gaura Barahaj",
        "id_city": "4754",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gulariya Bhindara",
        "id_city": "4779",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gursarai",
        "id_city": "4782",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hastinapur",
        "id_city": "4797",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kandwa",
        "id_city": "4859",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Katra Medniganj",
        "id_city": "4874",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kauriaganj",
        "id_city": "4875",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khairagarh",
        "id_city": "4883",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khudaganj",
        "id_city": "4896",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kora Jahanabad",
        "id_city": "4907",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kursath",
        "id_city": "4919",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mahona",
        "id_city": "4943",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mau",
        "id_city": "4964",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maurawan",
        "id_city": "4968",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nandgaon",
        "id_city": "5008",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nizamabad",
        "id_city": "5021",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nyotini",
        "id_city": "5026",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Aminagar Urf Bhurbaral",
        "id_city": "4555",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Aonla",
        "id_city": "4562",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ballia",
        "id_city": "4600",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bareilly",
        "id_city": "4612",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bareilly Cantonment",
        "id_city": "4613",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barkhera",
        "id_city": "4617",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhadohi",
        "id_city": "4631",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bharwari",
        "id_city": "4637",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilrayaganj",
        "id_city": "4656",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chopan",
        "id_city": "4692",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Churk Ghurma",
        "id_city": "4695",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dundwaraganj",
        "id_city": "4724",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Farah",
        "id_city": "4732",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hafizpur",
        "id_city": "4784",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jagner",
        "id_city": "4809",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jahangirabad",
        "id_city": "4811",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jalalpur",
        "id_city": "4817",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jansath",
        "id_city": "4822",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jatari",
        "id_city": "4826",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jewar",
        "id_city": "4828",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jyotiba Phule Nagar",
        "id_city": "4840",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Karnawal",
        "id_city": "4868",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khairabad",
        "id_city": "4882",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kosi Kalan",
        "id_city": "4909",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mallanwam",
        "id_city": "4950",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maruadih",
        "id_city": "4958",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mehndawal",
        "id_city": "4972",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Muhammadabad",
        "id_city": "4991",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Narauli",
        "id_city": "5011",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nichlaul",
        "id_city": "5016",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Allahabad",
        "id_city": "4546",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Anpara",
        "id_city": "4559",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Atarra",
        "id_city": "4566",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Babugarh",
        "id_city": "4583",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bakewar",
        "id_city": "4597",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Baragaon",
        "id_city": "4610",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Behta Hajipur",
        "id_city": "4624",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dasna",
        "id_city": "4701",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dibiyapur",
        "id_city": "4717",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ekdil",
        "id_city": "4725",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Erich",
        "id_city": "4726",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Etah",
        "id_city": "4727",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fatehabad",
        "id_city": "4738",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fatehganj Purvi",
        "id_city": "4740",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gauri Bazar",
        "id_city": "4755",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghorawal",
        "id_city": "4762",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghosia Bazar",
        "id_city": "4764",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gulaothi",
        "id_city": "4777",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gunnaur",
        "id_city": "4780",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jalalabad",
        "id_city": "4815",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhansi Railway Settlement",
        "id_city": "4832",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kachhauna Patseni",
        "id_city": "4842",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kadaura",
        "id_city": "4845",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kakori",
        "id_city": "4852",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kasganj",
        "id_city": "4869",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Katra",
        "id_city": "4873",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khalilabad",
        "id_city": "4884",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khatauli Rural",
        "id_city": "4892",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khurja",
        "id_city": "4897",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kiraoli",
        "id_city": "4899",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kunwargaon",
        "id_city": "4916",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maholi",
        "id_city": "4942",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mundia",
        "id_city": "4994",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nanaunta",
        "id_city": "5007",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nanpara",
        "id_city": "5009",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nyoria Husenpur",
        "id_city": "5025",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Paintepur",
        "id_city": "5035",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Atraulia",
        "id_city": "4569",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Babina",
        "id_city": "4581",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bangarmau",
        "id_city": "4604",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Banki",
        "id_city": "4605",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bidhuna",
        "id_city": "4646",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Burhana",
        "id_city": "4670",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dharoti Khurd",
        "id_city": "4713",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dulhipur",
        "id_city": "4723",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghiror",
        "id_city": "4761",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gokul",
        "id_city": "4767",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gulariya",
        "id_city": "4778",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hasayan",
        "id_city": "4796",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hata",
        "id_city": "4798",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kalinagar",
        "id_city": "4854",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kandhla",
        "id_city": "4858",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maghar",
        "id_city": "4937",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Majhara Pipar Ehatmali",
        "id_city": "4947",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mauranipur",
        "id_city": "4967",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mirat Cantonment",
        "id_city": "4977",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mubarakpur",
        "id_city": "4988",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Muradnagar",
        "id_city": "4996",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nautanwa",
        "id_city": "5014",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nidhauli Kalan",
        "id_city": "5017",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Oel Dhakwa",
        "id_city": "5028",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Amanpur",
        "id_city": "4549",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Amila",
        "id_city": "4552",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ashrafpur Kichhauchha",
        "id_city": "4565",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Atasu",
        "id_city": "4567",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bachhiowan",
        "id_city": "4584",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bahjoi",
        "id_city": "4592",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bajna",
        "id_city": "4596",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Basti",
        "id_city": "4621",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bharthana",
        "id_city": "4635",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bisokhar",
        "id_city": "4664",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chhibramau",
        "id_city": "4686",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chhutmalpur",
        "id_city": "4687",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dadri",
        "id_city": "4697",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Faridpur",
        "id_city": "4734",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Firozabad",
        "id_city": "4745",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ganga Ghat",
        "id_city": "4747",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ghosi",
        "id_city": "4763",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gopiganj",
        "id_city": "4772",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hamirpur",
        "id_city": "4787",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Iglas",
        "id_city": "4802",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Iltifatganj Bazar",
        "id_city": "4804",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Itaunja",
        "id_city": "4807",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhusi Kohna",
        "id_city": "4836",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kachhla",
        "id_city": "4843",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kemri",
        "id_city": "4876",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kunda",
        "id_city": "4914",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kushinagar",
        "id_city": "4921",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Madhogarh",
        "id_city": "4936",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mandawar",
        "id_city": "4951",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Milak",
        "id_city": "4974",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mogra Badshahpur",
        "id_city": "4982",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mohiuddinpur",
        "id_city": "4985",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nagram",
        "id_city": "5002",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nai Bazar",
        "id_city": "5003",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nainana Jat",
        "id_city": "5004",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nurpur",
        "id_city": "5024",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Parichha",
        "id_city": "5039",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ajhuwa",
        "id_city": "4541",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Aminagar Sarai",
        "id_city": "4554",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bad",
        "id_city": "4586",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barhani",
        "id_city": "4615",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhatpar Rani",
        "id_city": "4639",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bijnor",
        "id_city": "4648",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bindki",
        "id_city": "4659",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bisauli",
        "id_city": "4662",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chhatari",
        "id_city": "4685",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dhaurhra",
        "id_city": "4715",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Garhmukteshwar",
        "id_city": "4753",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gorakhpur",
        "id_city": "4773",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gursahaiganj",
        "id_city": "4781",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jaswantnagar",
        "id_city": "4825",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kailashpur",
        "id_city": "4847",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kaimganj",
        "id_city": "4848",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kaptanganj",
        "id_city": "4864",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khanpur",
        "id_city": "4886",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kiratpur",
        "id_city": "4900",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kundarki",
        "id_city": "4915",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mahroni",
        "id_city": "4944",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mundora",
        "id_city": "4995",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nakur",
        "id_city": "5006",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Niwari",
        "id_city": "5020",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Palia Kalan",
        "id_city": "5037",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Armapur Estate",
        "id_city": "4563",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Azizpur",
        "id_city": "4577",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Baheri",
        "id_city": "4591",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bharuhana",
        "id_city": "4636",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bikapur",
        "id_city": "4650",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilari",
        "id_city": "4651",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Biswan",
        "id_city": "4665",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bithur",
        "id_city": "4666",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chandpur",
        "id_city": "4677",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Choubepur Kalan",
        "id_city": "4693",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dariyabad",
        "id_city": "4700",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Faizabad",
        "id_city": "4729",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Faridpur Cantonment",
        "id_city": "4735",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gyanpur",
        "id_city": "4783",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jalali",
        "id_city": "4816",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Karaon",
        "id_city": "4865",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kerakat",
        "id_city": "4877",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kharkhoda",
        "id_city": "4890",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khatauli",
        "id_city": "4891",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khekra",
        "id_city": "4893",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kheri",
        "id_city": "4894",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Konch",
        "id_city": "4905",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kusmara",
        "id_city": "4922",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Malihabad",
        "id_city": "4949",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Manjhanpur",
        "id_city": "4954",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mirzapur",
        "id_city": "4979",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Musafirkhana",
        "id_city": "4998",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Oran",
        "id_city": "5030",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ordinance Factory Muradnagar",
        "id_city": "5031",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Alapur",
        "id_city": "4543",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Azmatgarh",
        "id_city": "4578",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bachhraon",
        "id_city": "4585",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bahadurganj",
        "id_city": "4590",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bahua",
        "id_city": "4595",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bansi",
        "id_city": "4608",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Beswan",
        "id_city": "4628",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bewar",
        "id_city": "4629",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhagwantnagar",
        "id_city": "4632",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhojpur Dharampur",
        "id_city": "4642",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilsi",
        "id_city": "4658",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bulandshahar",
        "id_city": "4669",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chakeri",
        "id_city": "4673",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chhaprauli",
        "id_city": "4681",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chhata",
        "id_city": "4684",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Colonelganj",
        "id_city": "4696",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Daurala",
        "id_city": "4703",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Faizganj",
        "id_city": "4731",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gangapur",
        "id_city": "4748",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Garautha",
        "id_city": "4751",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Harraiya",
        "id_city": "4794",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jangipur",
        "id_city": "4821",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jarwal",
        "id_city": "4823",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhansi",
        "id_city": "4830",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhansi Cantonment",
        "id_city": "4831",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Joya",
        "id_city": "4838",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kabrai",
        "id_city": "4841",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kadipur",
        "id_city": "4846",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kakgaina",
        "id_city": "4850",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kampil",
        "id_city": "4857",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Karhal",
        "id_city": "4867",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kotra",
        "id_city": "4911",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Madhoganj",
        "id_city": "4935",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Majhauli Raj",
        "id_city": "4948",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maniyar",
        "id_city": "4953",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Marehra",
        "id_city": "4956",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mendu",
        "id_city": "4973",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mursan",
        "id_city": "4997",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Naraura",
        "id_city": "5012",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Allahabad Cantonment",
        "id_city": "4547",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Allahganj",
        "id_city": "4548",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ambahta",
        "id_city": "4550",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Amethi",
        "id_city": "4551",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Anupshahr",
        "id_city": "4561",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barva Sagar",
        "id_city": "4619",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bela",
        "id_city": "4625",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bilaspur",
        "id_city": "4652",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chak Imam Ali",
        "id_city": "4672",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dankaur",
        "id_city": "4699",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dayal Bagh",
        "id_city": "4704",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Deoband",
        "id_city": "4705",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Faizabad Cantonment",
        "id_city": "4730",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Fariha",
        "id_city": "4736",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Itimadpur",
        "id_city": "4808",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhinjhak",
        "id_city": "4833",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jhusi",
        "id_city": "4835",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kairana",
        "id_city": "4849",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kakrala",
        "id_city": "4853",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kanpur",
        "id_city": "4861",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Katghar Lalganj",
        "id_city": "4871",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Khaga",
        "id_city": "4879",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kheta Sarai",
        "id_city": "4895",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Korwa",
        "id_city": "4908",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mahmudabad",
        "id_city": "4940",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Manikpur",
        "id_city": "4952",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Maswasi",
        "id_city": "4959",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mathura",
        "id_city": "4962",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mehnagar",
        "id_city": "4971",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mohanpur",
        "id_city": "4984",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Muhammadi",
        "id_city": "4992",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Mukrampur Khema",
        "id_city": "4993",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Akbarpur",
        "id_city": "4542",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Amroha",
        "id_city": "4557",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Auraiya",
        "id_city": "4570",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Awagarh",
        "id_city": "4574",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ayodhya",
        "id_city": "4575",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Baberu",
        "id_city": "4580",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Beniganj",
        "id_city": "4627",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bharatganj",
        "id_city": "4633",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Gangoh",
        "id_city": "4749",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Handia",
        "id_city": "4788",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Hathras",
        "id_city": "4799",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Islamnagar",
        "id_city": "4806",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Jalesar",
        "id_city": "4819",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Kanth",
        "id_city": "4863",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lalitpur",
        "id_city": "4927",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lar",
        "id_city": "4928",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Lawar",
        "id_city": "4929",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Muzaffarnagar",
        "id_city": "4999",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Nadigaon",
        "id_city": "5000",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Obra",
        "id_city": "5027",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Parasi",
        "id_city": "5038",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Patala",
        "id_city": "5042",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pinahat",
        "id_city": "5054",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Purqazi",
        "id_city": "5063",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ramkola",
        "id_city": "5071",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Saiyadraja",
        "id_city": "5110",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sewarhi",
        "id_city": "5134",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shohratgarh",
        "id_city": "5152",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sitapur",
        "id_city": "5168",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Suriyawan",
        "id_city": "5177",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Umri",
        "id_city": "5203",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dharchula",
        "id_city": "5241",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Haldwani",
        "id_city": "5251",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Srinagar",
        "id_city": "5304",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Uttarkashi",
        "id_city": "5309",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Vikasnagar",
        "id_city": "5310",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Andul",
        "id_city": "5326",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bagra",
        "id_city": "5341",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bahula",
        "id_city": "5345",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bali Chak",
        "id_city": "5352",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bally",
        "id_city": "5354",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Banarhat Tea Garden",
        "id_city": "5357",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Banshra",
        "id_city": "5363",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bhandardaha",
        "id_city": "5385",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bilandapur",
        "id_city": "5394",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chachanda",
        "id_city": "5407",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chamrail",
        "id_city": "5417",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chandrakona",
        "id_city": "5420",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Cooch Behar",
        "id_city": "5434",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dakshin Rajyadharpur",
        "id_city": "5438",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dinhata",
        "id_city": "5462",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gairkata",
        "id_city": "5475",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Haripur",
        "id_city": "5505",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pipri",
        "id_city": "5058",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pratapgarh",
        "id_city": "5059",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rajapur",
        "id_city": "5070",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ramnagar",
        "id_city": "5072",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rampura",
        "id_city": "5077",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Richha",
        "id_city": "5086",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Robertsganj",
        "id_city": "5089",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sadabad",
        "id_city": "5097",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sahjanwa",
        "id_city": "5106",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sakhanu",
        "id_city": "5111",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Salon",
        "id_city": "5115",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Satrikh",
        "id_city": "5129",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shahjahanpur Cantonment",
        "id_city": "5139",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shisgarh",
        "id_city": "5148",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sirsa",
        "id_city": "5163",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tundla Kham",
        "id_city": "5198",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Varanasi",
        "id_city": "5211",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Zamania",
        "id_city": "5218",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dineshpur",
        "id_city": "5244",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Doiwala",
        "id_city": "5245",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Gangotri",
        "id_city": "5249",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Nagla",
        "id_city": "5282",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Pithoragarh",
        "id_city": "5288",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Sultanpur",
        "id_city": "5305",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Bakreswar",
        "id_city": "5349",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bamunari",
        "id_city": "5356",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bansbaria",
        "id_city": "5362",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chapui",
        "id_city": "5422",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chata Kalikapur",
        "id_city": "5426",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chittaranjan",
        "id_city": "5432",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dubrajpur",
        "id_city": "5463",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Guma",
        "id_city": "5493",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Guskhara",
        "id_city": "5496",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jala Kendua",
        "id_city": "5522",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jhorhat",
        "id_city": "5535",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pipalsana Chaudhari",
        "id_city": "5055",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sahibabad",
        "id_city": "5105",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sahpau",
        "id_city": "5107",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Samdhan",
        "id_city": "5118",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shahganj",
        "id_city": "5136",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shamsabad",
        "id_city": "5142",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shikarpur",
        "id_city": "5146",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shivrajpur",
        "id_city": "5151",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tikri",
        "id_city": "5190",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tindwari",
        "id_city": "5192",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tori Fatehpur",
        "id_city": "5195",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tundla Railway Colony",
        "id_city": "5199",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ugu",
        "id_city": "5200",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dhandera",
        "id_city": "5240",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Mahua Kheraganj",
        "id_city": "5277",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Manglaur",
        "id_city": "5278",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Raipur",
        "id_city": "5290",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Sitarganj",
        "id_city": "5303",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Amalhara",
        "id_city": "5321",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Anksa",
        "id_city": "5327",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bagnan",
        "id_city": "5340",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Beldubi",
        "id_city": "5381",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bhangri Pratham Khanda",
        "id_city": "5387",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chakalampur",
        "id_city": "5411",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chikrand",
        "id_city": "5431",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dakshin Baguan",
        "id_city": "5436",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Defahat",
        "id_city": "5446",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Digha",
        "id_city": "5460",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ingraj Bazar",
        "id_city": "5516",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Islampur",
        "id_city": "5517",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pilkana",
        "id_city": "5052",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sambhawali",
        "id_city": "5117",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shergarh",
        "id_city": "5144",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sisauli",
        "id_city": "5166",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sumerpur",
        "id_city": "5176",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chamoli and Gopeshwar",
        "id_city": "5232",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Clement Town",
        "id_city": "5234",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Khatima",
        "id_city": "5266",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kichha",
        "id_city": "5267",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Landhaura Cantonment",
        "id_city": "5273",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Narendranagar",
        "id_city": "5286",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Pauri",
        "id_city": "5287",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Virbhadra",
        "id_city": "5311",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Amlagora",
        "id_city": "5323",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ankurhati",
        "id_city": "5328",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Arambagh",
        "id_city": "5330",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Belebathan",
        "id_city": "5382",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bilpahari",
        "id_city": "5395",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chakpara",
        "id_city": "5414",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhakuria",
        "id_city": "5449",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhulian",
        "id_city": "5456",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Garbeta Amlagora",
        "id_city": "5478",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Garui",
        "id_city": "5481",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gurdaha",
        "id_city": "5494",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Haldibari",
        "id_city": "5499",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Harharia Chak",
        "id_city": "5502",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jagadanandapur",
        "id_city": "5519",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jalpaiguri",
        "id_city": "5525",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rae Bareilly",
        "id_city": "5068",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rasulabad",
        "id_city": "5081",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Risia Bazar",
        "id_city": "5087",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sahaswan",
        "id_city": "5103",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sarai akil",
        "id_city": "5123",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sukhmalpur Nizamabad",
        "id_city": "5174",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Varanasi Cantonment",
        "id_city": "5212",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Vijaigarh",
        "id_city": "5213",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Dehrakhas",
        "id_city": "5237",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Gadarpur",
        "id_city": "5248",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kausani",
        "id_city": "5263",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Lensdaun",
        "id_city": "5274",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Rudrapur",
        "id_city": "5299",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Bahirgram",
        "id_city": "5344",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barrackpore",
        "id_city": "5373",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bhadreswar",
        "id_city": "5384",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bhanowara",
        "id_city": "5388",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Contai",
        "id_city": "5433",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dakshin Jhapardaha",
        "id_city": "5437",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Darap Pur",
        "id_city": "5442",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Darjiling",
        "id_city": "5443",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhandadihi",
        "id_city": "5450",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Egra",
        "id_city": "5467",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Falakata",
        "id_city": "5469",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Hatsimla",
        "id_city": "5508",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jalkhura",
        "id_city": "5524",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Parsadepur",
        "id_city": "5041",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Roza",
        "id_city": "5090",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sarila",
        "id_city": "5126",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Saurikh",
        "id_city": "5131",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Siyana",
        "id_city": "5169",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sonbhadra",
        "id_city": "5171",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Titron",
        "id_city": "5194",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Utraula",
        "id_city": "5210",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Zafarabad",
        "id_city": "5216",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Zaidpur",
        "id_city": "5217",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Almora",
        "id_city": "5219",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Champawat",
        "id_city": "5233",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kalagarh",
        "id_city": "5259",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Lalkuan",
        "id_city": "5271",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Ramnagar",
        "id_city": "5292",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Rishikesh",
        "id_city": "5295",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Shaktigarh",
        "id_city": "5302",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Tehri",
        "id_city": "5307",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Udham Singh Nagar",
        "id_city": "5308",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Bablari Dewanganj",
        "id_city": "5336",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bandel",
        "id_city": "5358",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baruihuda",
        "id_city": "5374",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baska",
        "id_city": "5378",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bolpur",
        "id_city": "5401",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Cart Road",
        "id_city": "5406",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chauhati",
        "id_city": "5427",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dalkola",
        "id_city": "5440",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Durgapur",
        "id_city": "5465",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Garhbeta",
        "id_city": "5479",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Garshyamnagar",
        "id_city": "5480",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gobindapur",
        "id_city": "5489",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Halisahar",
        "id_city": "5500",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Hatgachha",
        "id_city": "5507",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Howrah",
        "id_city": "5512",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Patti",
        "id_city": "5044",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pilkhuwa",
        "id_city": "5053",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ranipur",
        "id_city": "5078",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rudauli",
        "id_city": "5092",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sainthal",
        "id_city": "5109",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sakit",
        "id_city": "5112",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Salimpur",
        "id_city": "5114",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sambhal",
        "id_city": "5116",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sarsawan",
        "id_city": "5127",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sasni",
        "id_city": "5128",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sidhauli",
        "id_city": "5155",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Suar",
        "id_city": "5173",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tikaitnagar",
        "id_city": "5189",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tilhar",
        "id_city": "5191",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Usaihat",
        "id_city": "5208",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Wazirganj",
        "id_city": "5215",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Badrinathpuri",
        "id_city": "5221",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Bazpur",
        "id_city": "5227",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Gauchar",
        "id_city": "5250",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Nainital",
        "id_city": "5283",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Nainital Cantonment",
        "id_city": "5284",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Aiho",
        "id_city": "5316",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baj Baj",
        "id_city": "5348",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Balurghat",
        "id_city": "5355",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Beldanga",
        "id_city": "5380",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Beliator",
        "id_city": "5383",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bipra Noapara",
        "id_city": "5396",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dalurband",
        "id_city": "5441",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Debipur",
        "id_city": "5445",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gora Bazar",
        "id_city": "5492",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jangipur",
        "id_city": "5527",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jot Kamal",
        "id_city": "5538",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kachu Pukur",
        "id_city": "5539",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rasra",
        "id_city": "5080",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rustamnagar Sahaspur",
        "id_city": "5095",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Saharanpur",
        "id_city": "5101",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sardhana",
        "id_city": "5125",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sikandra Rao",
        "id_city": "5160",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tambaur",
        "id_city": "5182",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tatarpur Lallu",
        "id_city": "5184",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Un",
        "id_city": "5205",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bageshwar",
        "id_city": "5222",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Bah Bazar",
        "id_city": "5223",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Banbasa",
        "id_city": "5224",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Dehradun",
        "id_city": "5236",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kaladungi",
        "id_city": "5258",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Karnaprayang",
        "id_city": "5260",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Ranikhet",
        "id_city": "5293",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Roorkee",
        "id_city": "5297",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Tanakpur",
        "id_city": "5306",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Alipur Duar Railway Junction",
        "id_city": "5319",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Amodghata",
        "id_city": "5324",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baharampur",
        "id_city": "5343",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bangaon",
        "id_city": "5359",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bankra",
        "id_city": "5360",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bara Bamonia",
        "id_city": "5365",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barijhati",
        "id_city": "5371",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barjora",
        "id_city": "5372",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bholar Dabri",
        "id_city": "5390",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Birnagar",
        "id_city": "5398",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bowali",
        "id_city": "5403",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chhora",
        "id_city": "5430",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Daulatpur",
        "id_city": "5444",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ghatal",
        "id_city": "5484",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ghorsala",
        "id_city": "5485",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Goasafat",
        "id_city": "5487",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ichha Pur Defence Estate",
        "id_city": "5515",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rabupura",
        "id_city": "5066",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rampur Karkhana",
        "id_city": "5075",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Saidpur",
        "id_city": "5108",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sarauli",
        "id_city": "5124",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Saunkh",
        "id_city": "5130",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Singahi Bhiraura",
        "id_city": "5161",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Almora Cantonment",
        "id_city": "5220",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Dhaluwala",
        "id_city": "5239",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Dharchula Dehat",
        "id_city": "5242",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kachnal Gosain",
        "id_city": "5257",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Nandaprayang",
        "id_city": "5285",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Aurangabad",
        "id_city": "5335",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baghdogra",
        "id_city": "5339",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barakpur",
        "id_city": "5366",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bongaon",
        "id_city": "5402",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chandannagar",
        "id_city": "5418",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chandpur",
        "id_city": "5419",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chelad",
        "id_city": "5429",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dainhat",
        "id_city": "5435",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhuilya",
        "id_city": "5454",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhupgari",
        "id_city": "5457",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jemari",
        "id_city": "5530",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raja Ka Rampur",
        "id_city": "5069",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sadat",
        "id_city": "5098",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sirsaganj",
        "id_city": "5164",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Swamibagh",
        "id_city": "5178",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bandia",
        "id_city": "5225",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Bhim Tal",
        "id_city": "5228",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Dugadda",
        "id_city": "5246",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Haridwar",
        "id_city": "5252",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Laksar",
        "id_city": "5270",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Landaura",
        "id_city": "5272",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Logahat",
        "id_city": "5275",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Mahua Dabra Haripura",
        "id_city": "5276",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Mohanpur Mohammadpur",
        "id_city": "5280",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Ranipur",
        "id_city": "5294",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Ahmadpur",
        "id_city": "5315",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Alpur",
        "id_city": "5320",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Amkula",
        "id_city": "5322",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Amtala",
        "id_city": "5325",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Arsha",
        "id_city": "5332",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baranagar",
        "id_city": "5368",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bhangar Raghunathpur",
        "id_city": "5386",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Canning",
        "id_city": "5405",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chak Kashipur",
        "id_city": "5410",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Char Maijdia",
        "id_city": "5424",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Eksara",
        "id_city": "5468",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Fort Gloster",
        "id_city": "5472",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gangarampur",
        "id_city": "5476",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gopalpur",
        "id_city": "5490",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Hugli-Chunchura",
        "id_city": "5513",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jagtaj",
        "id_city": "5521",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jamuria",
        "id_city": "5526",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jhargram",
        "id_city": "5534",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jiaganj-Azimganj",
        "id_city": "5536",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Joka",
        "id_city": "5537",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pipraich",
        "id_city": "5057",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Purwa",
        "id_city": "5064",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Radha Kund",
        "id_city": "5067",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rampur",
        "id_city": "5073",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Renukut",
        "id_city": "5084",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sahaspur",
        "id_city": "5102",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sahawar",
        "id_city": "5104",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sandila",
        "id_city": "5121",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sewal Khas",
        "id_city": "5133",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sherkot",
        "id_city": "5145",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Siddhanur",
        "id_city": "5153",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sikandarpur",
        "id_city": "5158",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sirsi",
        "id_city": "5165",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Siswa Bazar",
        "id_city": "5167",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sultanpur",
        "id_city": "5175",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Unchahar",
        "id_city": "5206",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Adra",
        "id_city": "5314",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Argari",
        "id_city": "5331",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ashoknagar Kalyangarh",
        "id_city": "5334",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bagula",
        "id_city": "5342",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Basirhat",
        "id_city": "5377",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Burdwan",
        "id_city": "5404",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhanyakuria",
        "id_city": "5451",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhusaripara",
        "id_city": "5458",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Habra",
        "id_city": "5497",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Hijuli",
        "id_city": "5509",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kajora",
        "id_city": "5540",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Patiyali",
        "id_city": "5043",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Qasimpur",
        "id_city": "5065",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rath",
        "id_city": "5082",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Safipur",
        "id_city": "5099",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Salarpur Khadar",
        "id_city": "5113",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Seohara",
        "id_city": "5132",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Siddharthnagar",
        "id_city": "5154",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sidhpura",
        "id_city": "5156",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Soron",
        "id_city": "5172",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tajpur",
        "id_city": "5179",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Talbahat",
        "id_city": "5180",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tetribazar",
        "id_city": "5185",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tirwaganj",
        "id_city": "5193",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ujhari",
        "id_city": "5202",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Vrindavan",
        "id_city": "5214",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chakrata",
        "id_city": "5230",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Devaprayag",
        "id_city": "5238",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Didihat",
        "id_city": "5243",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Jhabrera",
        "id_city": "5255",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Pratitnagar",
        "id_city": "5289",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Raiwala",
        "id_city": "5291",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Baidyabati",
        "id_city": "5346",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bairatisal",
        "id_city": "5347",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Balarampur",
        "id_city": "5351",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ballavpur",
        "id_city": "5353",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Biki Hakola",
        "id_city": "5393",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chak Bankola",
        "id_city": "5408",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chakbansberia",
        "id_city": "5412",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhatri Gram",
        "id_city": "5453",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Fatellapur",
        "id_city": "5471",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Garulia",
        "id_city": "5482",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gayespur",
        "id_city": "5483",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Harindanga",
        "id_city": "5503",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Haringhata",
        "id_city": "5504",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Phalauda",
        "id_city": "5046",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pihani",
        "id_city": "5050",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pilibhit",
        "id_city": "5051",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rampur Maniharan",
        "id_city": "5076",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Reoti",
        "id_city": "5085",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rudayan",
        "id_city": "5093",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rura",
        "id_city": "5094",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shahjahanpur",
        "id_city": "5138",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shivdaspur",
        "id_city": "5149",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shivli",
        "id_city": "5150",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sikandarabad",
        "id_city": "5157",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Umri Kalan",
        "id_city": "5204",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Alipur Duar",
        "id_city": "5318",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baduria",
        "id_city": "5338",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barddhaman",
        "id_city": "5370",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Birlapur",
        "id_city": "5397",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bishnupur",
        "id_city": "5400",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Deulia",
        "id_city": "5448",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dhulagari",
        "id_city": "5455",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dumjor",
        "id_city": "5464",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gabberia",
        "id_city": "5473",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Goaljan",
        "id_city": "5486",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Haldia",
        "id_city": "5498",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Harishpur",
        "id_city": "5506",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Hindustan Cables Town",
        "id_city": "5510",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jaldhaka",
        "id_city": "5523",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jetia",
        "id_city": "5532",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pawayan",
        "id_city": "5045",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Phaphund",
        "id_city": "5047",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Phulwaria",
        "id_city": "5049",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shahi",
        "id_city": "5137",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shankargarh",
        "id_city": "5143",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Talgram",
        "id_city": "5181",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Thiriya Nizamat Khan",
        "id_city": "5188",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Unnao",
        "id_city": "5207",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Chamba",
        "id_city": "5231",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Dwarahat",
        "id_city": "5247",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Herbertpur",
        "id_city": "5253",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Joshimath",
        "id_city": "5256",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kashirampur",
        "id_city": "5262",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kedarnath",
        "id_city": "5264",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Masuri",
        "id_city": "5279",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Rishikesh Cantonment",
        "id_city": "5296",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Rurki",
        "id_city": "5300",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Aistala",
        "id_city": "5317",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bankura",
        "id_city": "5361",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barunda",
        "id_city": "5376",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Begampur",
        "id_city": "5379",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bidyadharpur",
        "id_city": "5392",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chak Enayetnagar",
        "id_city": "5409",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chakdaha",
        "id_city": "5413",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Champdani",
        "id_city": "5416",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Chapari",
        "id_city": "5421",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Checha Khata",
        "id_city": "5428",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Diamond Harbour",
        "id_city": "5459",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dignala",
        "id_city": "5461",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Farakka",
        "id_city": "5470",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Guriahati",
        "id_city": "5495",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jaygaon",
        "id_city": "5528",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pukhrayan",
        "id_city": "5060",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rampur Bhawanipur",
        "id_city": "5074",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sabatwar",
        "id_city": "5096",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sandi",
        "id_city": "5120",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shahabad",
        "id_city": "5135",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shahpur",
        "id_city": "5140",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shamli",
        "id_city": "5141",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Shikohabad",
        "id_city": "5147",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sikandra",
        "id_city": "5159",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Som",
        "id_city": "5170",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tanda",
        "id_city": "5183",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Barkot",
        "id_city": "5226",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Dehra Dun Cantonment",
        "id_city": "5235",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Jaspur",
        "id_city": "5254",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kashipur",
        "id_city": "5261",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kelakhera",
        "id_city": "5265",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Muni Ki Reti",
        "id_city": "5281",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Anup Nagar",
        "id_city": "5329",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bhatpara",
        "id_city": "5389",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bisarpara",
        "id_city": "5399",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Champahati",
        "id_city": "5415",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Char Brahmanagar",
        "id_city": "5423",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Durllabhganj",
        "id_city": "5466",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gadigachha",
        "id_city": "5474",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gobardanga",
        "id_city": "5488",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Gopinathpur",
        "id_city": "5491",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Haora",
        "id_city": "5501",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Hooghly",
        "id_city": "5511",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jafarpur",
        "id_city": "5518",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jagdishpur",
        "id_city": "5520",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jemari Township",
        "id_city": "5531",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jhalida",
        "id_city": "5533",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Phulpur",
        "id_city": "5048",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Pipiganj",
        "id_city": "5056",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Puranpur",
        "id_city": "5061",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Purdil Nagar",
        "id_city": "5062",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rashidpur Garhi",
        "id_city": "5079",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Raya",
        "id_city": "5083",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rithora",
        "id_city": "5088",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Rudarpur",
        "id_city": "5091",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sahanpur",
        "id_city": "5100",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Samthar",
        "id_city": "5119",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sarai Mir",
        "id_city": "5122",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Sirathu",
        "id_city": "5162",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Thakurdwara",
        "id_city": "5186",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Thana Bhawan",
        "id_city": "5187",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tulsipur",
        "id_city": "5196",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Tundla",
        "id_city": "5197",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Ujhani",
        "id_city": "5201",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Usawan",
        "id_city": "5209",
        "state_name": "Uttar Pradesh"
      },
      {
        "city_name": "Bhowali",
        "id_city": "5229",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kirtinagar",
        "id_city": "5268",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Kotdwara",
        "id_city": "5269",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Rudraprayag",
        "id_city": "5298",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "Rurki Cantonment",
        "id_city": "5301",
        "state_name": "Uttarakhand"
      },
      {
        "city_name": "24 Parganas (n)",
        "id_city": "5312",
        "state_name": "West Bengal"
      },
      {
        "city_name": "24 Parganas (s)",
        "id_city": "5313",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Asansol",
        "id_city": "5333",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Badhagachhi",
        "id_city": "5337",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Balaram Pota",
        "id_city": "5350",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Banupur",
        "id_city": "5364",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barakpur Cantonment",
        "id_city": "5367",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Barasat",
        "id_city": "5369",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Baruipur",
        "id_city": "5375",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Bidhannagar",
        "id_city": "5391",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Charka",
        "id_city": "5425",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dakshin Raypur",
        "id_city": "5439",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Deora",
        "id_city": "5447",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Dharmapur",
        "id_city": "5452",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Garalgachha",
        "id_city": "5477",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Humaipur",
        "id_city": "5514",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Jaynagar-Majilpur",
        "id_city": "5529",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Karsiyang",
        "id_city": "5558",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Maslandapur",
        "id_city": "5609",
        "state_name": "West Bengal"
      },
      {
        "city_name": "New Barrackpore",
        "id_city": "5632",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Old Maldah",
        "id_city": "5639",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pairagachha",
        "id_city": "5641",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pandua",
        "id_city": "5645",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raghunathpur-Magra",
        "id_city": "5674",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rishra Cantonment",
        "id_city": "5689",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sirsha",
        "id_city": "5710",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ulubaria",
        "id_city": "5732",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kanyanagar",
        "id_city": "5556",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khantora",
        "id_city": "5571",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Konnogar",
        "id_city": "5585",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mahishadal",
        "id_city": "5601",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Murshidabad",
        "id_city": "5619",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Palashban",
        "id_city": "5642",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Paniara",
        "id_city": "5647",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raghudebpur",
        "id_city": "5670",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raigachhi",
        "id_city": "5675",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rampur Hat",
        "id_city": "5683",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Santoshpur",
        "id_city": "5697",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Shrirampur",
        "id_city": "5705",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Thermal Power Project",
        "id_city": "5726",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kalaikunda",
        "id_city": "5543",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Madanpur",
        "id_city": "5594",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Maheshtala",
        "id_city": "5597",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nachhratpur Katabari",
        "id_city": "5623",
        "state_name": "West Bengal"
      },
      {
        "city_name": "North Barakpur",
        "id_city": "5637",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ondal",
        "id_city": "5640",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Parasia",
        "id_city": "5652",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Patulia",
        "id_city": "5660",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ratibati",
        "id_city": "5686",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sarenga",
        "id_city": "5699",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sobhaganj",
        "id_city": "5712",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Goara",
        "id_city": "5734",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Mahammadpur",
        "id_city": "5738",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kamarhati",
        "id_city": "5549",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kantlia",
        "id_city": "5555",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khalia",
        "id_city": "5568",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Krishnapur",
        "id_city": "5587",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pangachhiya",
        "id_city": "5646",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Parashkol",
        "id_city": "5651",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Patrasaer",
        "id_city": "5657",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raghunathpur",
        "id_city": "5672",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ramchandrapur",
        "id_city": "5680",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Talbandha",
        "id_city": "5721",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Kamakhyaguri",
        "id_city": "5736",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kendua",
        "id_city": "5565",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kesabpur",
        "id_city": "5566",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kharagpur",
        "id_city": "5572",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kharsarai",
        "id_city": "5577",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kodalia",
        "id_city": "5580",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kshidirpur",
        "id_city": "5588",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kulti",
        "id_city": "5591",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mahiari",
        "id_city": "5598",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pujali",
        "id_city": "5665",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Durgapur",
        "id_city": "5733",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Pirpur",
        "id_city": "5739",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttarpara-Kotrung",
        "id_city": "5741",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kakdwip",
        "id_city": "5542",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kanchrapara",
        "id_city": "5551",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kendra Khottamdi",
        "id_city": "5564",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kharagpur Railway Settlement",
        "id_city": "5573",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mal",
        "id_city": "5604",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mandarbani",
        "id_city": "5606",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Memari",
        "id_city": "5612",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nebadhai Duttapukur",
        "id_city": "5631",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Panuhat",
        "id_city": "5649",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Purba Medinipur",
        "id_city": "5666",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raghudebbati",
        "id_city": "5669",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sahapur",
        "id_city": "5692",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Shankhanagar",
        "id_city": "5703",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sonamukhi",
        "id_city": "5714",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Tinsukia",
        "id_city": "5727",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kaugachhi",
        "id_city": "5562",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khandra",
        "id_city": "5570",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Malda",
        "id_city": "5605",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mansinhapur",
        "id_city": "5607",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Naihati",
        "id_city": "5625",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nokpul",
        "id_city": "5636",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ranaghat",
        "id_city": "5684",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kalna",
        "id_city": "5547",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kalyani",
        "id_city": "5548",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kasimbazar",
        "id_city": "5560",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Katwa",
        "id_city": "5561",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kuperskem",
        "id_city": "5593",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Madhusudanpur",
        "id_city": "5595",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Midnapur",
        "id_city": "5613",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mrigala",
        "id_city": "5616",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Murgathaul",
        "id_city": "5618",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Natibpur",
        "id_city": "5628",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Panihati",
        "id_city": "5648",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ramjibanpur",
        "id_city": "5681",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raniganj",
        "id_city": "5685",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Salap",
        "id_city": "5694",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Shantipur",
        "id_city": "5704",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Siduli",
        "id_city": "5706",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Tentulkuli",
        "id_city": "5725",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kanaipur",
        "id_city": "5550",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kharar",
        "id_city": "5574",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khodarampur",
        "id_city": "5579",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Navadwip",
        "id_city": "5630",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Purba Tajpur",
        "id_city": "5667",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rajpur",
        "id_city": "5679",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sainthia",
        "id_city": "5693",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Tarakeswar",
        "id_city": "5723",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kalara",
        "id_city": "5544",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khardaha",
        "id_city": "5575",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khari Mala Khagrabari",
        "id_city": "5576",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kolaghat",
        "id_city": "5581",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Makardaha",
        "id_city": "5603",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nadia",
        "id_city": "5624",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Noapara",
        "id_city": "5635",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raghunathchak",
        "id_city": "5671",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raiganj",
        "id_city": "5676",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Serpur",
        "id_city": "5702",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Taki",
        "id_city": "5720",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kaliyaganj",
        "id_city": "5546",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kankuria",
        "id_city": "5554",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khatra",
        "id_city": "5578",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kolkata",
        "id_city": "5583",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Krishnanagar",
        "id_city": "5586",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kulihanda",
        "id_city": "5590",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kunustara",
        "id_city": "5592",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mainaguri",
        "id_city": "5602",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Monoharpur",
        "id_city": "5615",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Naupala",
        "id_city": "5629",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Panchpara",
        "id_city": "5644",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Parui",
        "id_city": "5654",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Pattabong Tea Garden",
        "id_city": "5658",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Podara",
        "id_city": "5662",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ramnagar",
        "id_city": "5682",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Saontaidih",
        "id_city": "5698",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Srikantabati",
        "id_city": "5716",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Tamluk",
        "id_city": "5722",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kakdihi",
        "id_city": "5541",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khalor",
        "id_city": "5569",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Konardihi",
        "id_city": "5584",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mathabhanga",
        "id_city": "5610",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nabadhai Dutta Pukur",
        "id_city": "5620",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nabgram",
        "id_city": "5622",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Odlabari",
        "id_city": "5638",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Panchla",
        "id_city": "5643",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Patuli",
        "id_city": "5659",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Port Blair",
        "id_city": "5663",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Simla",
        "id_city": "5708",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sodpur",
        "id_city": "5713",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Raypur",
        "id_city": "5740",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kanki",
        "id_city": "5553",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Khagrabari",
        "id_city": "5567",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kolaghat Thermal Power Project",
        "id_city": "5582",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mahira",
        "id_city": "5600",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mirik",
        "id_city": "5614",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Par Beliya",
        "id_city": "5650",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Paschim Punro Para",
        "id_city": "5656",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Prayagpur",
        "id_city": "5664",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Purulia",
        "id_city": "5668",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raghunathpur-Dankuni",
        "id_city": "5673",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raypur",
        "id_city": "5687",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sarpi",
        "id_city": "5700",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Singur",
        "id_city": "5709",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sonatikiri",
        "id_city": "5715",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Taherpur",
        "id_city": "5719",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Tentulberia",
        "id_city": "5724",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Tufanganj",
        "id_city": "5729",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Kalas",
        "id_city": "5735",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Madhyamgram",
        "id_city": "5596",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Paschim Jitpur",
        "id_city": "5655",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ruiya",
        "id_city": "5690",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sankarpur",
        "id_city": "5695",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Satigachha",
        "id_city": "5701",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Siliguri",
        "id_city": "5707",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Siuri",
        "id_city": "5711",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Titagarh",
        "id_city": "5728",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ula",
        "id_city": "5731",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kalimpong",
        "id_city": "5545",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kandi",
        "id_city": "5552",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Karimpur",
        "id_city": "5557",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Masila",
        "id_city": "5608",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nabagram",
        "id_city": "5621",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nalhati",
        "id_city": "5626",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ni Barakpur",
        "id_city": "5633",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nibra",
        "id_city": "5634",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Parbbatipur",
        "id_city": "5653",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Raipur",
        "id_city": "5677",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sankrail",
        "id_city": "5696",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Uttar Latabari",
        "id_city": "5737",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kasba",
        "id_city": "5559",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kenda",
        "id_city": "5563",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Kshirpai",
        "id_city": "5589",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mahikpur",
        "id_city": "5599",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Mekliganj",
        "id_city": "5611",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Muragachha",
        "id_city": "5617",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Nasra",
        "id_city": "5627",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Phulia",
        "id_city": "5661",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rajarhat Gopalpur",
        "id_city": "5678",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Rishra",
        "id_city": "5688",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sahajadpur",
        "id_city": "5691",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Srirampur",
        "id_city": "5717",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Sukdal",
        "id_city": "5718",
        "state_name": "West Bengal"
      },
      {
        "city_name": "Ukhra",
        "id_city": "5730",
        "state_name": "West Bengal"
      }
    ]

    const cityCollection = db.collection("cities");
    const stateCollection = db.collection("states");
    
    const BATCH_SIZE = 1000;
    const now = new Date();
    
    console.log(`🔄 Starting migration with ${cityArray.length} cities...`);
    
    const uniqueStates = [...new Set(cityArray.map(city => city.state_name))];
    console.log(`📊 Found ${uniqueStates.length} unique states`);

    const stateMap = new Map();
    
    console.log(`🔍 Creating state name to ID mapping...`);
    const allStates = await stateCollection.find({ 
      state_name: { $in: uniqueStates } 
    }, { projection: { _id: 1, state_name: 1 } }).toArray();
    
    allStates.forEach(state => {
      stateMap.set(state.state_name, state._id);
    });
    
    console.log(`✅ State mapping created with ${stateMap.size} states`);
    
    const cityBatches = [];
    for (let i = 0; i < cityArray.length; i += BATCH_SIZE) {
      cityBatches.push(cityArray.slice(i, i + BATCH_SIZE));
    }
    
    console.log(`📦 Processing ${cityArray.length} cities in ${cityBatches.length} batches...`);
    
    let totalMatched = 0;
    let totalModified = 0;
    let totalUpserted = 0;
    let skippedCities = 0;
    
    for (let batchIndex = 0; batchIndex < cityBatches.length; batchIndex++) {
      const cityBatch = cityBatches[batchIndex];
      const cityBulkOps = [];
      
      for (const city of cityBatch) {
        const stateId = stateMap.get(city.state_name);
        
        if (!stateId) {
          skippedCities++;
          continue;
        }
        
        cityBulkOps.push({
          updateOne: {
            filter: {
              $or: [
                { id_city: city.id_city },
                { city_name: city.city_name, id_state: stateId }
              ]
            },
            update: {
              $setOnInsert: {
                id_city: city.id_city,
                createdAt: now,
              },
              $set: {
                updatedAt: now,
                city_name: city.city_name,
                id_state: stateId,
                state_name: city.state_name
              }
            },
            upsert: true
          }
        });
        
      }
      
      if (cityBulkOps.length > 0) {
        const result = await cityCollection.bulkWrite(cityBulkOps, { ordered: false });
        
        totalMatched += result.matchedCount;
        totalModified += result.modifiedCount;
        totalUpserted += result.upsertedCount;
        
        console.log(`   ✅ Processed city batch ${batchIndex + 1}/${cityBatches.length} (${cityBulkOps.length} operations)`);
        
        if (batchIndex < cityBatches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    console.log(`🔧 Creating indexes...`);
    await cityCollection.createIndex({ id_city: 1 }, { unique: true, sparse: true });
    await cityCollection.createIndex({ city_name: 1, state_id: 1 });
    await cityCollection.createIndex({ state_id: 1 });

    
    console.log(`🎉 Migration completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   Total cities processed: ${cityArray.length}`);
    console.log(`   Cities skipped (no state): ${skippedCities}`);
    console.log(`   Total matched: ${totalMatched}`);
    console.log(`   Total modified: ${totalModified}`);
    console.log(`   Total upserted: ${totalUpserted}`);
    console.log(`   Total states: ${stateMap.size}`);
    
  } catch (error) {
    console.error("❌ Seeder error:", error);
    throw error;
  }
};