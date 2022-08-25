use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };
use near_sdk::{ AccountId };

pub type DataId = String;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct DataEntry {
    uploader: AccountId,
    encrypted_symmetric_key: String,
    encrypted_data: String,
    title: String,
}

impl DataEntry {
    pub fn new(uploader: AccountId, encrypted_symmetric_key: String, encrypted_data: String, title: String) -> Self {
        Self {
            uploader,
            encrypted_symmetric_key,
            encrypted_data,
            title,
        }
    } 

    pub fn get_uploader(&self) -> AccountId {
        self.uploader.clone()
    }

    pub fn get_encrypted_symmetric_key(&self) -> String {
        self.encrypted_symmetric_key.clone()
    }

    pub fn get_encrypted_data(&self) -> String {
        self.encrypted_data.clone()
    }

    pub fn get_title(&self) -> String {
        self.title.clone()
    }
}