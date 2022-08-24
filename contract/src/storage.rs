use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };
use near_sdk::{ AccountId };

pub type DataId = u64;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct DataEntry {
    uploader: AccountId,
    encrypted_symmetric_key: String,
    encrypted_data: String,
}

impl DataEntry {
    pub fn new(uploader: AccountId, encrypted_symmetric_key: String, encrypted_data: String) -> Self {
        Self {
            uploader,
            encrypted_symmetric_key,
            encrypted_data,
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
}