// Generate 6 character long id
function generateId() {
    return Date.now().toString(36).substring(6, 8) + Math.random().toString(36).substring(2, 6);
}

export async function addAccountInfo(public_key) {
    return await window.contract.add_account_info({ public_key });
}

export async function getAccountPublicKey(account_id) {
    return await window.contract.get_account_public_key({ account_id });
}

export async function addContributor(new_contributor) {
    return await window.contract.add_contributor({ new_contributor });
}

export async function getAccountContributors(account_id) {
    return await window.contract.get_account_contributors({ account_id });
}

export async function removeContributor(removed_contributor) {
    return await window.contract.remove_contributor({ removed_contributor });
}

export async function uploadData(account_id, encrypted_symmetric_key, encrypted_data, title) {
    let data_id = generateId()
    return await window.contract.upload_data({ account_id, data_id, encrypted_symmetric_key, encrypted_data, title });
}

export async function getAccountDataIds(account_id) {
    return await window.contract.get_account_data_ids({ account_id });
} 

export async function getEncryptedSymmetricKey(data_id) {
    return await window.contract.get_encrypted_symmetric_key({ data_id });
} 

export async function getEncryptedData(data_id) {
    return await window.contract.get_encrypted_data({ data_id });
} 

export async function getDataUploader(data_id) {
    return await window.contract.get_data_uploader({ data_id });
} 

export async function getDataTitle(data_id) {
    return await window.contract.get_data_title({ data_id });
}
