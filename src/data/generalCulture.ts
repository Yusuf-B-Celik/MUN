export interface CountryCulture {
  id: string;
  name: string;
  nativeName: string;
  capital: string;
  population: string;
  language: string;
  currency: string;
  flagUrl: string;
  sections: {
    title: string;
    icon: string;
    content: string;
  }[];
}

export const generalCultureData: Record<string, CountryCulture> = {
  albania: {
    id: "albania",
    name: "Arnavutluk",
    nativeName: "Shqipëria",
    capital: "Tiran",
    population: "2.8 Milyon (Yaklaşık)",
    language: "Arnavutça",
    currency: "Lek (ALL)",
    flagUrl: "🇦🇱",
    sections: [
      {
        title: "Tarih ve Köken",
        icon: "🏛️",
        content: "Arnavutlar, Balkanlar'ın en eski yerli halklarından biri olan İliryalıların soyundan gelmektedir. Yüzyıllar boyunca Roma, Bizans ve yaklaşık 500 yıl boyunca Osmanlı İmparatorluğu egemenliği altında kalmıştır. II. Dünya Savaşı sonrasında Enver Hoca liderliğinde dünyanın en izole komünist rejimlerinden birini yaşamış, 1991 yılında ise demokrasiye geçiş yapmıştır."
      },
      {
        title: "Coğrafya ve Doğa",
        icon: "🏔️",
        content: "Balkan Yarımadası'nın batısında yer alan Arnavutluk, Adriyatik ve İyon denizlerine kıyısı olan muazzam bir sahil şeridine sahiptir. Ülkenin iç kesimleri yüksek ve sarp dağlarla (Arnavut Alpleri) kaplıdır. Ksamil, Saranda gibi sahil şehirleri turistik açıdan son derece popülerdir."
      },
      {
        title: "Kültür ve 'Besa' Geleneği",
        icon: "🤝",
        content: "Arnavut kültürünün en önemli yapı taşlarından biri 'Besa' kanunudur. Türkçe'ye 'söz verme' veya 'güven' olarak çevrilebilecek olan Besa, bir konuğu canı pahasına korumayı ve yardıma ihtiyacı olanı geri çevirmemeyi emreden kadim bir ahlak kodudur. Bu gelenek sayesinde, II. Dünya Savaşı sırasında Arnavutluk'ta Yahudi nüfusu savaş öncesine göre artış gösteren tek Avrupa ülkesi olmuştur."
      },
      {
        title: "NATO ve MUN Bağlamı",
        icon: "🛡️",
        content: "Arnavutluk, 1 Nisan 2009 tarihinde NATO'ya katılmıştır. Adriyatik Denizi ve Balkanlar'daki stratejik konumu nedeniyle ittifakın Güney Kanadı (Southern Flank) güvenliğinde kritik bir rol oynamaktadır. Rusya'nın Ukrayna'yı işgalini şiddetle kınayan ülke, NATO'nun '360 derece güvenlik' yaklaşımını savunarak Doğu ile Güney kanatlarının güvenliğinin birbirinden ayrılamayacağını belirtmektedir."
      }
    ]
  },
  croatia: {
    id: "crocity",
    name: "Hırvatistan",
    nativeName: "Hrvatska",
    capital: "Zagreb",
    population: "3.8 Milyon (Yaklaşık)",
    language: "Hırvatça",
    currency: "Euro (EUR)",
    flagUrl: "🇭🇷",
    sections: [
      {
        title: "Tarih ve Miras",
        icon: "🏰",
        content: "7. yüzyılda bölgeye yerleşen Hırvatlar, tarih boyunca Macaristan Krallığı, Habsburg İmparatorluğu ve Venedik Cumhuriyeti'nin etkisinde kalmıştır. I. Dünya Savaşı'ndan sonra Yugoslavya'nın bir parçası olmuş, 1991'deki bağımsızlık savaşı (Domovinski Rat) sonrasında bağımsız bir devlet haline gelmiştir. Dubrovnik gibi surlarla çevrili tarihi liman kentleri adeta açık hava müzesi niteliğindedir."
      },
      {
        title: "Coğrafya ve Adalar Ülkesi",
        icon: "🌊",
        content: "Hırvatistan, Adriyatik Denizi boyunca uzanan 1000'den fazla adaya ve girintili çıkıntılı büyüleyici bir sahil şeridine sahiptir. Plitvice Gölleri Ulusal Parkı gibi dünyaca ünlü doğal güzellikleri barındırır. Ülkenin kıyı bölgelerinde Akdeniz, iç kesimlerinde ise karasal iklim hakimdir."
      },
      {
        title: "Kravatın Kökeni ve Kültür",
        icon: "👔",
        content: "Bugün tüm dünyada iş yaşamının vazgeçilmezi olan kravatın (cravat) kökeni Hırvat askerlerine dayanır. 17. yüzyılda Otuz Yıl Savaşları sırasında Paris'e giden Hırvat paralı askerlerinin boyunlarına taktıkları kendilerine özgü atkılar, Fransız Kralı XIV. Louis'nin ilgisini çekmiş ve buradan 'cravate' ismiyle dünyaya yayılmıştır. Ayrıca ülkede köklü bir açık hava kahve kültürü ('špica') mevcuttur."
      },
      {
        title: "NATO ve MUN Bağlamı",
        icon: "⚔️",
        content: "Hırvatistan, Arnavutluk ile aynı gün olan 1 Nisan 2009'da NATO üyesi olmuştur. Balkanlar'daki istikrarın ve Adriyatik'in savunmasının bel kemiklerinden biridir. MUN simülasyonlarında, ittifak içi dayanışmayı, Ukrayna'ya insani ve askeri yardımların koordinasyonunu ve özellikle Karadeniz ile Akdeniz güvenlik hatlarının korunmasını güçlü bir şekilde savunur."
      }
    ]
  }
};
