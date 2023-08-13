browser.storage.local.get(/* String or Array */["bannaddress"], function(items){
    if(typeof items.bannaddress  === 'undefined') {
        console.log("no address saved");
        window.location.href = 'connect.html';
    } else {
        console.log(items.bannaddress);
        window.location.href = 'wallet.html';
    }
  });