exports.run = (client, message, args) => {

  return message.channel.send('🏓 Pong! '+client.ws.ping.toFixed()+'ms! ');
  
};
exports.config = {
  aliases: [], // exports.help.name kısmında ki değer dışında ne yazılırsa komut çalıştırılacak? örnek: ['pong', 'pingim'], 
  requiredPermissions: [], // komutu kullananın hangi yetkilere sahip olması gerektiği. örnek: ['MANAGE_CHANNELS', 'ADD_REACTIONS'],
  requiredPermissionsMe: [], // botun bu komutu çalıştırabilmesi için hangi yetkilere sahip olması gerektiği. örnek: ['ATTACH_FILES'],
  filterServerOwner: false, // false yaparsanız komutu yetkisi yeten herkes, true yaparsanız sadece sunucu sahibi kullanabilir
  runInDM: true,// false yaparsanız komut botun dmsinde çalışmaz, true yaparsanız botun dmsinde çalışır,
  cooldown: false// eğer ki false kısmını '10 saniye' yaparsanız bu komut bir kere kullanan kişi tekrar kullanmak için 10 saniye beklemek zorunda kalır.
};

exports.help = {
  name: 'ping'// komut ismi
};

/*

BU KOMUT ÖRNEKTİR, KOMUTU ÇALIŞTIRMAK İÇİN PREFİXİ YAZIP SONRA KOMUTUN İSMİNİ YAZMALISINIZ. BAŞKA KOMUT EKLEYECEKSENİZ,
EXPORTS.CONFIG VE EXPORTS.HELP DEĞERLER DIŞINDA AYNI OLMAK ZORUNDA YOKSA HATA ALIRSINIZ.

*/
