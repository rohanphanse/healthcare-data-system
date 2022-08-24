use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };

#[derive(BorshDeserialize, BorshSerialize)]
pub struct AccountInfo {
    public_key: String,
}

impl AccountInfo {
    pub fn new(public_key: String) -> Self {
        Self {
            public_key,
        }
    }

    pub fn get_public_key(&self) -> String {
        self.public_key.clone()
    }
}