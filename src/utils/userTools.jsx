import { userService } from "../_services/user.service";
import { defaultSettings } from "../components/settings/config-setting";

export function getConfigColumnFromList(userStored, listId, tableHead) {
    const defaultConfig = tableHead.reduce((config, column) => {

        config[column.id] = true; // initially show all columns
        return config;
      }, {});
    
      let columnConfig = defaultConfig;
      if(userStored.prefs && userStored.prefs.lists){
        let list = userStored.prefs.lists.find((a) => {return a.id == listId});
        if(list){
          columnConfig = list.cols;
        }
      }
    return columnConfig;
}

export function setConfigColumnFromList(userStored, listId, newCols) {
    if(!userStored.prefs.lists) {
        userStored.prefs.lists = [];
    }
    let listStored = userStored.prefs.lists.find((a) => {
        return a.id == listId;
    })
    let listOld = userStored.prefs.lists.filter((a) => {
        return a.id != listId;
    });
    if(!listStored) {
        listStored = {id: listId}
    }
    listStored.cols = newCols;

    userStored.prefs.lists = listOld;
    userStored.prefs.lists.push(listStored);
    
    localStorage.setItem('user', JSON.stringify(userStored));

    // call API
    //userService.setUserPrefs(userStored).catch(err => console.log(err));
}

export function setSettingsFromPanel(userStored, newSettings) {
    if(userStored && userStored.prefs) {
        userStored.prefs = {
            ...userStored.prefs,
            ...newSettings
        };
    } else {
        userStored.prefs = {
            ...defaultSettings,
            ...newSettings
        };
    }
    
    localStorage.setItem('user', JSON.stringify(userStored));

    // call API
    //userService.setUserPrefs(userStored).catch(err => console.log(err));
}