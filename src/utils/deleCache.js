import CryptoJS from 'crypto-js'

export function destroyCache(vnode) {
  if (vnode && vnode.data.keepAlive) {
        if (vnode.parent && vnode.parent.componentInstance && vnode.parent.componentInstance.cache) {
            if (vnode.componentOptions) {
                var key = vnode.key == null
                            ? vnode.componentOptions.Ctor.cid + (vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
                            : vnode.key;
                var cache = vnode.parent.componentInstance.cache;
                var keys  = vnode.parent.componentInstance.keys;
                if (cache[key]) {
                    if (keys.length) {
                        var index = keys.indexOf(key);
                        if (index > -1) {
                            keys.splice(index, 1);
                        }
                    }
                    delete cache[key];
                }
            }
        }
  }
  //this.$destroy();
}

export function filterItems(filters, filterName) {
    
    for(var i in filters) {
      //var name = i+'Q';
      var name = i;
      var status = false; //是否存在当前对象属性

      for(var j in filterName) {
        if (j == name) {
          status = true;
          filters[i][0] == undefined? filterName[j] = '' : filterName[j] = filters[i][0];
        }
      }

      if (status === false) {
        if (filters[i][0]) {
            filterName[name] = filters[i][0];
        } else {
            filterName[name] = "";
        }
        
      }

    }

    return filterName;
}

export function encryptByDES(message) {
    var key = '9DB4DBBA24306F45B553EF7DFC8A6290';
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}