use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };
use near_sdk::{ env, near_bindgen, AccountId };
use near_sdk::collections::{ UnorderedMap, UnorderedSet, Vector };

mod account;
use account::{ AccountInfo };
mod storage;
use storage::{ DataId, DataEntry };

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    account_map: UnorderedMap<AccountId, AccountInfo>,
    storage_list: Vector<DataEntry>,
    contributors_map: UnorderedMap<AccountId, UnorderedSet<AccountId>>,
    data_ids_map: UnorderedMap<AccountId, UnorderedSet<DataId>>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            account_map: UnorderedMap::<AccountId, AccountInfo>::new(b"a".to_vec()),
            storage_list: Vector::<DataEntry>::new(b"s".to_vec()),
            contributors_map: UnorderedMap::<AccountId, UnorderedSet<AccountId>>::new(b"c".to_vec()),
            data_ids_map: UnorderedMap::<AccountId, UnorderedSet<DataId>>::new(b"d".to_vec()),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn add_account_info(&mut self, public_key: String) {
        let account_id = env::signer_account_id();
        self.account_map.insert(&account_id, &AccountInfo::new(public_key));
    }

    pub fn get_account_public_key(&self, account_id: AccountId) -> Option<String> {
        let account_info_option = self.account_map.get(&account_id);
        match account_info_option {
            Some(account_info) => return Some(account_info.get_public_key()),
            None => return None,
        }
    }

    pub fn add_contributor(&mut self, new_contributor: AccountId) {
        let account_id = env::signer_account_id();
        let contributors_option = self.contributors_map.get(&account_id);
        match contributors_option {
            None => {
                let set_id: Vec<u8> = format!("c-{}", account_id).as_bytes().to_vec();
                self.contributors_map.insert(&account_id, &UnorderedSet::new(set_id));
            },
            _ => {},
        }
        let mut contributors = self.contributors_map.get(&account_id).unwrap();
        contributors.insert(&new_contributor);
        self.contributors_map.insert(&account_id, &contributors);
    }

    pub fn get_account_contributors(&self, account_id: AccountId) -> Vec<AccountId> {
        let contributors_option = self.contributors_map.get(&account_id);
        match contributors_option {
            Some(contributors) => return contributors.to_vec(),
            None => return vec![],
        }
    }

    pub fn remove_contributor(&mut self, removed_contributor: AccountId) {
        let account_id = env::signer_account_id();
        let contributors_option = self.contributors_map.get(&account_id);
        let mut contributors: UnorderedSet<AccountId>;
        match contributors_option {
            Some(c) => contributors = c,
            None => return,
        }
        contributors.remove(&removed_contributor);
        self.contributors_map.insert(&account_id, &contributors);
    }

    pub fn upload_data(&mut self, account_id: AccountId, encrypted_symmetric_key: String, encrypted_data: String) -> DataId {
        let signer_id = env::signer_account_id();
        if signer_id != account_id {
            let contributors_option = self.contributors_map.get(&account_id);
            let unallowed_contributor_error = format!("{} is not an allowed contributor to {}'s account", signer_id, account_id);
            match contributors_option {
                Some(contributors) => {
                    if !contributors.contains(&signer_id) { 
                        panic!("{}", unallowed_contributor_error); 
                    }
                },
                None => panic!("{}", unallowed_contributor_error),
            }
        }
        let data_entry = DataEntry::new(signer_id, encrypted_symmetric_key, encrypted_data);
        self.storage_list.push(&data_entry);
        let data_id = self.storage_list.len() - 1;
        match self.data_ids_map.get(&account_id) {
            None => {
                let set_id: Vec<u8> = format!("d-{}", account_id).as_bytes().to_vec();
                self.data_ids_map.insert(&account_id, &UnorderedSet::new(set_id));
            },
            _ => {},
        }
        let mut data_ids = self.data_ids_map.get(&account_id).unwrap();
        data_ids.insert(&data_id);
        self.data_ids_map.insert(&account_id, &data_ids);
        data_id
    }

    pub fn get_account_data_ids(&self, account_id: AccountId) -> Vec<DataId> {
        let data_ids_option = self.data_ids_map.get(&account_id);
        match data_ids_option {
            Some(data_ids) => return data_ids.to_vec(),
            None => return vec![],
        }
    }

    pub fn get_encrypted_data(&self, data_id: DataId) -> Option<String> {
        let data_entry_option = self.storage_list.get(data_id);
        match data_entry_option {
            Some(data_entry) => return Some(data_entry.get_encrypted_data()),
            None => return None,
        }
    }

    pub fn get_encrypted_symmetric_key(&self, data_id: DataId) -> Option<String> {
        let data_entry_option = self.storage_list.get(data_id);
        match data_entry_option {
            Some(data_entry) => return Some(data_entry.get_encrypted_symmetric_key()),
            None => return None,
        }
    }

    pub fn get_uploader(&self, data_id: DataId) -> Option<AccountId> {
        let data_entry_option = self.storage_list.get(data_id);
        match data_entry_option {
            Some(data_entry) => return Some(data_entry.get_uploader()),
            None => return None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{ VMContextBuilder };
    use near_sdk::{ testing_env, AccountId };

    // Credit: https://github.com/near-examples/crossword-tutorial-chapter-1/blob/d7699cf35092024fe11719b68788436c82fe82af/contract/src/lib.rs
    fn get_context(signer: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.signer_account_id(signer);
        builder
    }

    #[test]
    fn add_account_info_and_get_public_key() {
        let context = get_context("alice.testnet".parse::<AccountId>().unwrap());
        testing_env!(context.build());
        let mut contract = Contract::default();

        contract.add_account_info("I am a happy public key!".to_string());
        let public_key = contract.get_account_public_key("alice.testnet".parse::<AccountId>().unwrap());
        assert_eq!(
            public_key,
            Some("I am a happy public key!".to_string())
        );
    }

    #[test]
    fn add_get_and_remove_contributors() {
        let context = get_context("alice.testnet".parse::<AccountId>().unwrap());
        testing_env!(context.build());
        let mut contract = Contract::default();

        contract.add_contributor("bobs_doctor.testnet".parse::<AccountId>().unwrap());
        contract.add_contributor("bobs_brother.testnet".parse::<AccountId>().unwrap());
        contract.add_contributor("bobs_doctor_2.testnet".parse::<AccountId>().unwrap());
        assert_eq!(
            contract.get_account_contributors("alice.testnet".parse::<AccountId>().unwrap()),
            vec!["bobs_doctor.testnet".parse::<AccountId>().unwrap(), "bobs_brother.testnet".parse::<AccountId>().unwrap(), "bobs_doctor_2.testnet".parse::<AccountId>().unwrap()],
        );

        contract.remove_contributor("bobs_doctor.near".parse::<AccountId>().unwrap());
        println!(
            "Left: {:?}, right: {:?}",
            contract.get_account_contributors("alice.testnet".parse::<AccountId>().unwrap()),
            vec!["bobs_brother_near".parse::<AccountId>().unwrap(), "bobs_doctor_2_near".parse::<AccountId>().unwrap()],
        );
    }

    #[test] 
    fn upload_data_and_get_data_entry() {
        let context = get_context("alice.testnet".parse::<AccountId>().unwrap());
        testing_env!(context.build());
        let mut contract = Contract::default();

        let id_1 = contract.upload_data("alice.testnet".parse::<AccountId>().unwrap(), "enc sym key!".to_string(), "enc data!".to_string());
        // let error_2 = contract.upload_data("alice_near".parse::<AccountId>().unwrap(), "enc sym key!".to_string(), "enc data!".to_string());
        let id_3 = contract.upload_data("alice.testnet".parse::<AccountId>().unwrap(), "enc sym key 2!".to_string(), "enc data 2!".to_string());
        println!("Result 1: {:?}", id_1);
        println!("Result 3: {:?}", id_3);
        println!("Data ids: {:?}", contract.get_account_data_ids("alice.testnet".parse::<AccountId>().unwrap()));
        println!("Uploader id 1: {:?}", contract.get_uploader(id_1));
        println!("Key id 3: {:?}", contract.get_encrypted_symmetric_key(id_3));
        println!("Data id 3: {:?}", contract.get_encrypted_data(id_3));
    }
}