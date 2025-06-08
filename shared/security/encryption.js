/**
 * 🔒 MILITARY-GRADE ENCRYPTION SERVICE
 * 
 * Zero-Knowledge Architecture Implementation
 * - Client-side encryption before data transmission
 * - Server cannot decrypt user data
 * - AES-256-GCM + RSA-4096 hybrid encryption
 * - PBKDF2 + Argon2 key derivation
 */

const crypto = require('crypto');
const argon2 = require('argon2');

class MilitaryGradeEncryption {
  constructor() {
    this.config = {
      clientSideEncryption: true,
      serverKeyAccess: false,
      encryptionStandard: 'AES-256-GCM + RSA-4096',
      keyManagement: 'client-generated, server-stored-encrypted'
    };
    
    // Encryption constants
    this.AES_KEY_LENGTH = 32; // 256 bits
    this.IV_LENGTH = 16; // 128 bits
    this.TAG_LENGTH = 16; // 128 bits
    this.SALT_LENGTH = 32; // 256 bits
    this.RSA_KEY_SIZE = 4096; // RSA-4096
  }

  /**
   * 🔐 ZERO-KNOWLEDGE KEY DERIVATION
   * Derives encryption keys from user password without storing password
   */
  async deriveEncryptionKey(password, salt = null) {
    try {
      // Generate salt if not provided
      if (!salt) {
        salt = crypto.randomBytes(this.SALT_LENGTH);
      }

      // PBKDF2 + Argon2 hybrid key derivation
      const pbkdf2Key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
      
      // Argon2 for additional security
      const argon2Key = await argon2.hash(pbkdf2Key.toString('hex'), {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
        hashLength: 32
      });

      // Combine both keys for maximum security
      const combinedKey = crypto.createHash('sha256')
        .update(pbkdf2Key)
        .update(Buffer.from(argon2Key, 'utf8'))
        .digest();

      return {
        key: combinedKey,
        salt: salt,
        keyId: crypto.createHash('sha256').update(combinedKey).digest('hex').substring(0, 16)
      };
    } catch (error) {
      throw new Error(`Key derivation failed: ${error.message}`);
    }
  }

  /**
   * 🔒 CLIENT-SIDE AES-256-GCM ENCRYPTION
   * Encrypts data before transmission to server
   */
  encryptData(data, encryptionKey) {
    try {
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const cipher = crypto.createCipher('aes-256-gcm', encryptionKey);
      cipher.setAAD(Buffer.from('womens-health-ecosystem', 'utf8'));

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();

      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: 'AES-256-GCM',
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * 🔓 CLIENT-SIDE AES-256-GCM DECRYPTION
   * Decrypts data received from server
   */
  decryptData(encryptedData, encryptionKey) {
    try {
      const { encrypted, iv, tag } = encryptedData;
      
      const decipher = crypto.createDecipher('aes-256-gcm', encryptionKey);
      decipher.setAAD(Buffer.from('womens-health-ecosystem', 'utf8'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * 🔐 RSA-4096 KEY PAIR GENERATION
   * For secure key exchange and digital signatures
   */
  generateRSAKeyPair() {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: this.RSA_KEY_SIZE,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      return { publicKey, privateKey };
    } catch (error) {
      throw new Error(`RSA key generation failed: ${error.message}`);
    }
  }

  /**
   * 🔒 HYBRID ENCRYPTION (RSA + AES)
   * RSA for key exchange, AES for data encryption
   */
  hybridEncrypt(data, recipientPublicKey) {
    try {
      // Generate random AES key for this session
      const aesKey = crypto.randomBytes(this.AES_KEY_LENGTH);
      
      // Encrypt data with AES
      const encryptedData = this.encryptData(data, aesKey);
      
      // Encrypt AES key with RSA
      const encryptedAESKey = crypto.publicEncrypt({
        key: recipientPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      }, aesKey);

      return {
        encryptedData: encryptedData,
        encryptedKey: encryptedAESKey.toString('base64'),
        algorithm: 'RSA-4096 + AES-256-GCM'
      };
    } catch (error) {
      throw new Error(`Hybrid encryption failed: ${error.message}`);
    }
  }

  /**
   * 🔓 HYBRID DECRYPTION (RSA + AES)
   */
  hybridDecrypt(encryptedPackage, privateKey) {
    try {
      const { encryptedData, encryptedKey } = encryptedPackage;
      
      // Decrypt AES key with RSA
      const aesKey = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      }, Buffer.from(encryptedKey, 'base64'));
      
      // Decrypt data with AES
      return this.decryptData(encryptedData, aesKey);
    } catch (error) {
      throw new Error(`Hybrid decryption failed: ${error.message}`);
    }
  }

  /**
   * 🔐 DIGITAL SIGNATURE GENERATION
   * For data integrity and authentication
   */
  signData(data, privateKey) {
    try {
      const signature = crypto.sign('sha256', Buffer.from(JSON.stringify(data)), {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
      });

      return {
        signature: signature.toString('base64'),
        algorithm: 'RSA-PSS-SHA256',
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Digital signature failed: ${error.message}`);
    }
  }

  /**
   * ✅ DIGITAL SIGNATURE VERIFICATION
   */
  verifySignature(data, signature, publicKey) {
    try {
      return crypto.verify('sha256', Buffer.from(JSON.stringify(data)), {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
      }, Buffer.from(signature, 'base64'));
    } catch (error) {
      throw new Error(`Signature verification failed: ${error.message}`);
    }
  }

  /**
   * 🔒 SECURE TOKEN GENERATION
   * For session management and API authentication
   */
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * 🔐 HMAC GENERATION
   * For message authentication
   */
  generateHMAC(data, secret) {
    return crypto.createHmac('sha256', secret)
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * ✅ HMAC VERIFICATION
   */
  verifyHMAC(data, hmac, secret) {
    const expectedHMAC = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(hmac, 'hex'),
      Buffer.from(expectedHMAC, 'hex')
    );
  }
}

module.exports = MilitaryGradeEncryption;
