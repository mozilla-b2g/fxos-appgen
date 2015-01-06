/*
  This script will generate a complete_permissions.json file given
  PermissionsTable.jsm.
*/

var fs = require('fs');

DENY_ACTION = PROMPT_ACTION = ALLOW_ACTION = ""

function extract_from(name)
{
  fs.readFile(name, function(err, data) {
    if (err) {
      throw err;
    }

    // extract just the PermissionsTable itself
    var s = data.toString();
    var start = s.indexOf('this.PermissionsTable');
    var end = s.indexOf('};', start + 1);
    table = s.substr(start, end - start + 2);

    // eval it and create a json representation
    eval(table);
    names = Object.keys(PermissionsTable);
    names.sort();

    json = {}
    json.permissions = {}
    // see http://dxr.mozilla.org/mozilla-central/source/modules/libpref/init/all.js#796
    forbidden_perms = 'engineering-mode,embed-apps,embed-widgets';
    for (name in names) {
      permission = names[name];
      if ('access' in PermissionsTable[permission]) {
        access = PermissionsTable[permission].access;
        if (access.indexOf('write') != -1 && access.indexOf('create') != -1) {
          access.splice(access.indexOf('create'), 1);
        }
        if (forbidden_perms.indexOf(permission) == -1) {
          json.permissions[permission] = {'access': access.join('')}
        }
      } else {
        if (forbidden_perms.indexOf(permission) == -1) {
          json.permissions[permission] = {}
        }
      }
    }

    fs.writeFile('complete_permissions.json', JSON.stringify(json, null, 2), function(err) {
      if(err) {
        throw err;
      }
    });
  });
}

if (process.argv.length == 3) {
  extract_from(process.argv[2]);
} else {
  console.log('usage: nodejs extract_permissions.js <path to PermissionsTable.jsm');
}
