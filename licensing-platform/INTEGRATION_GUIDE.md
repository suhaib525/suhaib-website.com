# Integration Guide

This guide explains how to integrate the Licensing Platform with your software.

## Overview

The Licensing Platform provides a RESTful API that your software can use to validate licenses and enforce licensing terms. The integration typically involves:

1. Collecting hardware information (HWID)
2. Validating the license key with the platform
3. Handling the validation response
4. Managing license activation and deactivation

## Step 1: Collect Hardware Information

Your software needs to collect hardware identifiers to create a unique HWID. The platform uses this HWID to lock licenses to specific machines.

### Hardware Components to Collect

Collect as many of these components as possible:

- **MAC Address**: Primary network interface MAC address
- **Disk Serial**: Hard drive or SSD serial number
- **CPU ID**: Processor identifier
- **Motherboard Serial**: Motherboard serial number

### Example (Windows C++)

```cpp
#include <windows.h>
#include <iphlpapi.h>
#include <string>
#include <sstream>
#include <iomanip>

std::string GetMACAddress() {
    IP_ADAPTER_INFO adapterInfo[16];
    DWORD bufLen = sizeof(adapterInfo);
    
    if (GetAdaptersInfo(adapterInfo, &bufLen) == ERROR_SUCCESS) {
        return adapterInfo[0].Address;
    }
    return "";
}

std::string GetDiskSerial() {
    // Implementation depends on your specific requirements
    return "WDC123456789";
}

std::string GetCPUId() {
    // Implementation depends on your specific requirements
    return "Intel-i7-12345";
}
```

### Example (Node.js)

```javascript
const os = require('os');
const si = require('systeminformation');

async function getHWIDComponents() {
  const [network, disk, cpu] = await Promise.all([
    si.networkInterfaces(),
    si.diskLayout(),
    si.cpu()
  ]);

  return {
    mac: network[0]?.mac || '',
    disk: disk[0]?.serialNum || '',
    cpu: cpu.manufacturer + '-' + cpu.brand
  };
}
```

## Step 2: Validate License Key

Use the `/api/validate` endpoint to check if a license key is valid and activated on the current machine.

### API Request

```http
POST /api/validate
Content-Type: application/json

{
  "licenseKey": "ABCD-EFGH-IJKL-MNOP",
  "hwid": "hardware-id-hash"
}
```

### API Response

**Success:**
```json
{
  "valid": true,
  "license": {
    "id": "license-id",
    "key": "ABCD-EFGH-IJKL-MNOP",
    "type": "PERMANENT",
    "status": "ACTIVE",
    "expiresAt": null
  }
}
```

**Error:**
```json
{
  "error": "License not found"
}
```

### Implementation Example (C++ with libcurl)

```cpp
#include <curl/curl.h>
#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

bool ValidateLicense(const std::string& licenseKey, const std::string& hwid) {
    CURL *curl = curl_easy_init();
    if (!curl) return false;

    json requestData = {
        {"licenseKey", licenseKey},
        {"hwid", hwid}
    };
    
    std::string requestBody = requestData.dump();

    curl_easy_setopt(curl, CURLOPT_URL, "https://your-platform.com/api/validate");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, requestBody.c_str());
    curl_easy_setopt(curl, CURLOPT_POST, 1L);

    // Set headers
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    // Execute request
    CURLcode res = curl_easy_perform(curl);
    
    // Parse response
    // ... implementation depends on your JSON parser

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    return res == CURLE_OK;
}
```

## Step 3: Activate License

When a user first enters their license key, you should activate it on their machine.

### API Request

```http
POST /api/activate
Content-Type: application/json

{
  "licenseKey": "ABCD-EFGH-IJKL-MNOP",
  "hwidComponents": {
    "mac": "00:1A:2B:3C:4D:5E",
    "disk": "WDC123456789",
    "cpu": "Intel-i7-12345"
  }
}
```

### API Response

**Success:**
```json
{
  "success": true,
  "message": "License activated successfully",
  "activation": {
    "id": "activation-id",
    "licenseId": "license-id",
    "hwidId": "hwid-id",
    "ipAddress": "192.168.1.100",
    "isActive": true,
    "activatedAt": "2023-11-15T10:00:00.000Z"
  }
}
```

## Step 4: Handle License Validation Response

Based on the validation response, your software should:

1. **If valid**: Allow the software to run normally
2. **If invalid**: Show appropriate error message and restrict functionality
3. **If expired**: Notify user and provide renewal options
4. **If max activations reached**: Provide instructions for deactivation

### Example Implementation

```javascript
async function checkLicense() {
  const licenseKey = getStoredLicenseKey();
  const hwid = await generateHWID();

  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, hwid })
    });

    const data = await response.json();

    if (data.valid) {
      // License is valid, allow software to run
      showMainApplication();
    } else {
      // License is invalid, show error
      showLicenseError(data.error);
      showTrialMode();
    }
  } catch (error) {
    // Network error, handle offline case
    showOfflineMode();
  }
}
```

## Step 5: Implement Offline Activation (Optional)

For software that needs to work offline, consider implementing:

1. **Grace period**: Allow software to run for a limited time without validation
2. **Offline activation codes**: Generate one-time codes for offline activation
3. **Local validation**: Store validation results locally and check periodically

## Security Considerations

1. **Never hardcode API keys** in client-side code
2. **Use HTTPS** for all API communications
3. **Validate all API responses** before using them
4. **Implement tamper detection** to prevent bypassing license checks
5. **Obfuscate your code** to make reverse engineering more difficult
6. **Use code signing** to prevent tampering with your executable

## Error Handling

Handle these common error scenarios:

- **Network errors**: Provide offline functionality or retry mechanism
- **Invalid license**: Show clear error message with renewal options
- **Expired license**: Provide upgrade path
- **Max activations**: Guide user to deactivate on other machines
- **Server errors**: Implement retry logic with exponential backoff

## Testing Your Integration

1. Test with valid and invalid license keys
2. Test with different HWID configurations
3. Test network error scenarios
4. Test license expiration
5. Test max activation limits

## Best Practices

1. **Validate early**: Check license at startup before showing main UI
2. **Validate periodically**: Check license periodically during runtime
3. **Provide clear feedback**: Show users why their license is invalid
4. **Log validation attempts**: Help with debugging and fraud detection
5. **Implement trial mode**: Allow limited functionality without license

## Support

If you encounter issues with integration:

1. Check the API documentation
2. Review error messages and logs
3. Contact support with detailed information about the issue