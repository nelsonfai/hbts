import { API_BASE_URL } from "../appConstants";
import AsyncStorageService from "./asyncStorage";

const fetchPermission = async (setUser) => {

    try {
      const token = await AsyncStorageService.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/profile-info/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
        });

        if (response.ok) {
        
        const data = await response.json();
       
        const { id, email, name, profile_pic, team_invite_code, hasTeam, team_id, lang, isync, imageurl, premium, customerid, valid_till, subscription_type, subscription_code, productid, auto_renew_status, mypremium } = data;
        setUser((prevUser) => ({
            ...prevUser,
            id,
            email,
            name: name || prevUser.name,
            profile_pic,
            premium,
            team_invite_code,
            hasTeam,
            team_id,
            lang,
            isync,
            imageurl,
            customerid,
            valid_till,
            subscription_type,
            subscription_code,
            productid,
            auto_renew_status,
            mypremium
          }));
                  
        return premium
    }
      } else {
        return false
      }

    } catch (error) {
       // //('Error updating user 4:', error);
    }
};

export default fetchPermission;
