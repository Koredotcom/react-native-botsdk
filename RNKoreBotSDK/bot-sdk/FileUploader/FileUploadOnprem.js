import API_CONST from '../lib/services/api-constants';
//import RNFS from 'react-native-fs';
import MultipartData from './MultipartData';
import axios from 'axios';
import KoreBotClient from 'rn-kore-bot-socket-lib-v79';
import {getUserAgent} from 'react-native-user-agent';

class FileUploadOnprem {
  isStopLoading = false;
  file = null;
  fileContext = null;
  userId = null;
  accessToken = null;
  onProgress = null;
  onSuccess = null;
  currentChunk = 0;
  fileInfo = {};
  uploadedChunks = null;
  successChunks = 0;
  baseUrl = null;

  constructor(file, userId, fileContext, accessToken) {
    // Use smaller chunk size to avoid iOS NSInteger conversion issues
    // Ensure it's an integer value for consistent calculations
    this.CHUNK_SIZE = parseInt(512 * 1024, 10); // 512KB instead of 1MB

    //this.CHUNK_SIZE_INITIAL = 1024 * 1024;
    this.file = file;
    this.fileContext = fileContext;
    this.userId = userId;
    this.accessToken = accessToken;
    this.onProgress = null;
    this.onSuccess = null;
    // this.onError = null;
    this.currentChunk = 0;
    this.fileInfo = {};
    this.uploadedChunks = null;
    this.successChunks = 0;
    this.isStopLoading = false;
    this.baseUrl = KoreBotClient.getInstance().getBotUrl();
    
    // Cache for file data to avoid reading large files multiple times
    this.fileDataCache = null;
    this.cacheFilePath = null;
  }

  start = (
    onProgress = arg => {},
    onSuccess = arg => {},
    onError = arg => {},
  ) => {
    this.onProgress = onProgress;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this._processFile();
  };
  onError = msg => {
    console.log(msg);
  };

  stopLoading = () => {
    this.isStopLoading = true;
    this.clearFileCache();
  };

  clearFileCache = () => {
    // Clear file cache to free up memory
    this.fileDataCache = null;
    this.cacheFilePath = null;
  };

  validateAndNormalizeExtension = (extension, mimeType) => {
    // Common file extensions that are typically accepted
    const allowedExtensions = [
      // Images
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico',
      // Documents
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv',
      // Archives
      'zip', 'rar', '7z', 'tar', 'gz',
      // Audio
      'mp3', 'wav', 'aac', 'm4a', 'ogg', 'flac',
      // Video
      'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
      // Other
      'json', 'xml', 'html', 'css', 'js'
    ];

    // MIME type to extension mapping for fallback
    const mimeToExtension = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg', 
      'image/png': 'png',
      'image/gif': 'gif',
      'image/bmp': 'bmp',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/tiff': 'tiff',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'text/plain': 'txt',
      'text/csv': 'csv',
      'application/json': 'json',
      'text/html': 'html',
      'video/mp4': 'mp4',
      'video/quicktime': 'mov',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav'
    };

    // Clean the extension (remove any extra characters)
    let cleanExtension = extension ? extension.trim().replace(/[^a-z0-9]/g, '') : '';
    
    // If the extension is valid, use it
    if (cleanExtension && allowedExtensions.includes(cleanExtension)) {
      return cleanExtension;
    }
    
    // Try to get extension from MIME type
    if (mimeType && mimeToExtension[mimeType]) {
      console.log(`Using extension '${mimeToExtension[mimeType]}' derived from MIME type '${mimeType}'`);
      return mimeToExtension[mimeType];
    }
    
    // For images, if we can't determine the extension, default to jpg
    if (mimeType && mimeType.startsWith('image/')) {
      console.log('Defaulting to jpg for unknown image type');
      return 'jpg';
    }
    
    // If all else fails, try to make a reasonable guess
    if (cleanExtension) {
      // Some common extension normalizations
      if (cleanExtension === 'jpeg') return 'jpg';
      if (cleanExtension === 'tif') return 'tiff';
      if (cleanExtension === 'htm') return 'html';
      
      // If it's not in our allowed list but seems reasonable, try it anyway
      if (cleanExtension.length <= 5 && cleanExtension.match(/^[a-z0-9]+$/)) {
        console.log(`Using unrecognized but valid-looking extension: ${cleanExtension}`);
        return cleanExtension;
      }
    }
    
    // Last resort - default to a safe extension
    console.warn('Could not determine valid file extension, defaulting to txt');
    return 'txt';
  };

  sanitizeFileName = (fileName, extension) => {
    if (!fileName) {
      return `file_${Date.now()}.${extension}`;
    }

    // Remove the extension from the filename first
    let nameWithoutExt = fileName;
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      nameWithoutExt = fileName.substring(0, lastDotIndex);
    }

    // Replace problematic characters with underscores
    let sanitized = nameWithoutExt
      .replace(/[^a-zA-Z0-9\-_\s]/g, '_') // Replace special chars with underscore
      .replace(/\s+/g, '_') // Replace spaces with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

    // Ensure the filename isn't empty
    if (!sanitized || sanitized.length === 0) {
      sanitized = 'file_' + Date.now();
    }

    // Limit filename length (without extension)
    if (sanitized.length > 50) {
      sanitized = sanitized.substring(0, 50);
    }

    // Add the validated extension
    const finalFileName = `${sanitized}.${extension}`;
    
    if (finalFileName !== fileName) {
      console.log(`Sanitized filename from '${fileName}' to '${finalFileName}'`);
    }
    
    return finalFileName;
  };

  _processFile = () => {
    if (this.file && this.file.name) {
      //console.log('File is', this.file);
      // Handle both 'size' and 'fileSize' properties from different file sources
      const rawFileSize = this.file.size || this.file.fileSize || 0;
      // Ensure file size is a valid integer
      const fileSize = Math.max(0, parseInt(Number(rawFileSize), 10));
      
      if (fileSize <= 0) {
        console.error('FileUploadOnprem: Invalid file size detected', {
          rawFileSize,
          fileSize,
          fileObject: this.file
        });
        this.onError('INVALID_FILE_SIZE');
        return;
      }
      
      console.log('FileUploadOnprem: File size determined as:', fileSize, 'from file object:', {
        size: this.file.size,
        fileSize: this.file.fileSize,
        processedSize: fileSize
      });
      
      // Extract and validate file extension
      const rawExtension = this.file.name.split('.').pop()?.toLowerCase() || '';
      const validatedExtension = this.validateAndNormalizeExtension(rawExtension, this.file.type);
      
      console.log('FileUploadOnprem: Extension processing', {
        fileName: this.file.name,
        rawExtension,
        validatedExtension,
        mimeType: this.file.type
      });

      // Sanitize filename to avoid server issues
      const sanitizedFileName = this.sanitizeFileName(this.file.name, validatedExtension);
      
      this.fileInfo = {
        fileName: sanitizedFileName,
        fileType: validatedExtension,
        fileSize: fileSize,
        type: this.file.type,
        isChunkUpload: true,
      };

      // Fix total chunks calculation to be more accurate
      this.fileInfo.totalChunks = this.fileInfo.isChunkUpload
        ? Math.ceil(this.fileInfo.fileSize / this.CHUNK_SIZE)
        : 1;
      //Need to change here in future if we have media files also
      if (this.file?.type?.indexOf('image') !== -1) {
        this.fileInfo.type = 'image';
      } else {
        this.fileInfo.type = 'attachment';
      }

      this.fileInfo.isThumbnail = false;
      this._getFileToken();
    } else {
      this.onError('INVALID_FILE');
    }
  };

  _getFileToken = () => {
    const _self = this;
    if (_self.isStopLoading) {
      _self.onError('_getFileToken stop loading:' + this.file?.id);
      return;
    }

    // const payload = {
    //   fileContext: 'workflows',
    //   filename: _self.file.name,
    //   fileContentType: _self.file.type,
    //   fileType: _self.fileInfo.type,
    //   fileExtension: _self.fileInfo.fileType,
    //   fileSize: _self.file.size,
    //   target: 'server',
    // };
    // console.log('Pay load', payload);
    //
    let url = this.baseUrl + '/api/1.1/attachment/file/token';
    //let url = this.baseUrl + '/api/1.1/users/' + this.userId + '/file/token';
    let userAgent = 'RNApp/1.0';
    try {
      userAgent = getUserAgent() || 'RNApp/1.0';
    } catch (error) {
      console.log('getUserAgent error:', error);
      userAgent = 'RNApp/1.0';
    }
    const auth = KoreBotClient.getInstance().getAuthorization();
    axios({
      url,
      method: API_CONST.POST,
      data: {
        'User-Agent': userAgent,
      },
      headers: {
        Authorization: auth,
      },
    })
      .then(function (data) {
        if (_self.isStopLoading) {
          _self.onError('_getFileToken stop loading : ' + _self.file?.id);
          return;
        }
        _self.fileInfo.fileToken = data.data.fileToken;
        _self.fileInfo.fileTokenExpiresOn = data.data.expiresOn;

        _self._readyForUpload();
      })
      .catch(function (error) {
        _self.onError('_getFileToken error  --->:' + error);
      });
  };

  _readyForUpload = () => {
    this._initChunkUpload();
  };
  _initChunkUpload = () => {
    const _self = this;
    const totalChunks = this.fileInfo.totalChunks;
    const chunkSize = this.CHUNK_SIZE;
    console.log(
      'Id ' +
        _self.file?.id +
        '   this.currentChunk -------->:' +
        this.currentChunk +
        '/' +
        (totalChunks - 1),
    );
    const start = Math.floor(this.currentChunk * chunkSize);
    const fileSize = this.fileInfo.fileSize; // Use the processed file size from fileInfo
    const end =
      this.currentChunk === totalChunks - 1
        ? Math.floor(fileSize)
        : Math.floor((this.currentChunk + 1) * chunkSize);

    // Calculate the actual length to read (don't exceed file size)
    // Ensure we never have negative lengths or exceed chunk size
    const remainingBytes = Math.floor(fileSize) - start;
    const actualLength = Math.max(0, Math.min(chunkSize, remainingBytes));
    
    // Safety check: if actualLength is 0 or negative, we're done
    if (actualLength <= 0) {
      console.log('_initChunkUpload: No more data to read', {
        currentChunk: this.currentChunk,
        totalChunks,
        start,
        fileSize,
        remainingBytes,
        actualLength
      });
      return;
    }

    const progress = Math.floor(((this.currentChunk + 1) / totalChunks) * 100);
    this.onProgress(progress);
    if (_self.currentChunk === totalChunks) {
      return;
    }
    this.readChunkData(this.file?.path || this.file?.uri, actualLength, start)
      .then(chunk => {
        if (chunk) {
          this.uploadChunk(chunk, this.currentChunk);
        } else {
          console.log('readChunkData: No chunk data returned');
          this.onError('No chunk data returned');
        }
      })
      .catch(error => {
        console.log('readChunkData error --->:', error);
        this.onError('readChunkData error: ' + error.message);
      });
  };

  readChunkData = async (filePath, length, position) => {
    // COMPLETELY AVOID RNFS.read() by using a different approach
    // Instead of reading chunks, we'll read the entire file once and cache it
    
    // Ensure we have valid numeric inputs
    const rawLength = Number(length);
    const rawPosition = Number(position);
    
    if (isNaN(rawLength) || isNaN(rawPosition)) {
      console.log('readChunkData: Invalid numeric inputs', {length, position});
      return Promise.reject(new Error('Invalid numeric inputs'));
    }
    
    // Convert to safe integers
    const lengthInt = Math.max(0, Math.min(1048576, parseInt(rawLength, 10))); // Max 1MB chunk
    const positionInt = Math.max(0, parseInt(rawPosition, 10));
    
    // Additional safety checks
    if (lengthInt <= 0) {
      console.log('readChunkData: Invalid length after conversion', {original: length, converted: lengthInt});
      return Promise.reject(new Error('Invalid read length'));
    }
    if (positionInt < 0) {
      console.log('readChunkData: Invalid position after conversion', {original: position, converted: positionInt});
      return Promise.reject(new Error('Invalid read position'));
    }

    // Try react-native-blob-util first
    const blobUtilResult = await this.readChunkDataWithBlobUtil(filePath, lengthInt, positionInt);
    if (blobUtilResult) {
      return blobUtilResult;
    }

    // If blob-util fails, try RNFS.readFile (not RNFS.read!)
    return this.readChunkDataWithRNFSFullFile(filePath, lengthInt, positionInt);
  };

  readChunkDataWithBlobUtil = async (filePath, length, position) => {
    try {
      const RNBlobUtil = require('react-native-blob-util');
      
      if (!RNBlobUtil || !RNBlobUtil.fs) {
        return null;
      }

      const cleanFilePath = decodeURI(filePath);
      
      // Check if we need to read the file into cache
      if (!this.fileDataCache || this.cacheFilePath !== cleanFilePath) {
        console.log('readChunkData: Reading file into cache with RNBlobUtil');
        this.fileDataCache = await RNBlobUtil.fs.readFile(cleanFilePath, 'base64');
        this.cacheFilePath = cleanFilePath;
      }
      
      // Use the helper functions to slice the data
      const byteArray = this.base64ToByteArray(this.fileDataCache);
      const endPosition = Math.min(position + length, byteArray.length);
      
      if (position >= byteArray.length) {
        console.log('readChunkData: Position beyond file size', {position, fileSize: byteArray.length});
        return Promise.reject(new Error('Position beyond file size'));
      }
      
      const chunkArray = byteArray.slice(position, endPosition);
      const chunkBase64 = this.byteArrayToBase64(chunkArray);
      
      console.log(`readChunkData: Successfully read chunk of ${chunkArray.length} bytes using RNBlobUtil`);
      return chunkBase64;
      
    } catch (error) {
      console.log('readChunkData: RNBlobUtil failed:', error.message);
      return null;
    }
  };

  readChunkDataWithRNFSFullFile = async (filePath, length, position) => {
    try {
      const RNFS = require('react-native-fs');
      if (!RNFS || !RNFS.readFile) {
        console.log('readChunkData: RNFS.readFile not available');
        return Promise.reject(new Error('RNFS not available'));
      }

      const cleanFilePath = decodeURI(filePath);
      console.log(`readChunkData: Using RNFS.readFile for ${length} bytes from position ${position}`);
      
      // Check if we need to read the file into cache
      if (!this.fileDataCache || this.cacheFilePath !== cleanFilePath) {
        console.log('readChunkData: Reading file with RNFS.readFile (avoiding RNFS.read NSInteger issue)');
        // Use RNFS.readFile instead of RNFS.read to avoid NSInteger issues
        this.fileDataCache = await RNFS.readFile(cleanFilePath, 'base64');
        this.cacheFilePath = cleanFilePath;
      }
      
      // Use the helper functions to slice the data
      const byteArray = this.base64ToByteArray(this.fileDataCache);
      const endPosition = Math.min(position + length, byteArray.length);
      
      if (position >= byteArray.length) {
        console.log('readChunkData: Position beyond file size', {position, fileSize: byteArray.length});
        return Promise.reject(new Error('Position beyond file size'));
      }
      
      const chunkArray = byteArray.slice(position, endPosition);
      const chunkBase64 = this.byteArrayToBase64(chunkArray);
      
      console.log(`readChunkData: RNFS.readFile successfully read chunk of ${chunkArray.length} bytes`);
      return chunkBase64;
      
    } catch (error) {
      console.log('readChunkData: RNFS.readFile failed:', error.message);
      return Promise.reject(new Error('File reading failed: ' + error.message));
    }

  };

  // Helper function to convert base64 to byte array without Buffer
  base64ToByteArray = (base64) => {
    const binaryString = atob(base64);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  };

  // Helper function to convert byte array to base64 without Buffer
  byteArrayToBase64 = (byteArray) => {
    let binaryString = '';
    for (let i = 0; i < byteArray.length; i++) {
      binaryString += String.fromCharCode(byteArray[i]);
    }
    return btoa(binaryString);
  };


  uploadChunk = (chunk, chunkNumber) => {
    const _self = this;
    if (_self.isStopLoading) {
      _self.onError('uploadChunk stop loading : ' + _self.file?.id);
      return;
    }

    // Fix: Remove the incorrect increment operator
    // chunkNumber = chunkNumber++; // This was wrong - it assigns the original value then increments
    let agent = 'RNApp/1.0';
    try {
      agent = getUserAgent() || 'RNApp/1.0';
    } catch (error) {
      console.log('getUserAgent error:', error);
      agent = 'RNApp/1.0';
    }
    const formData = new MultipartData();
    formData.append('chunkNo', chunkNumber + '');
    formData.append('fileToken', _self.fileInfo.fileToken + '');
    formData.append('User-Agent', agent + '');

    formData.append('chunk', {
      data: chunk,
      fileName: _self.fileInfo.fileName,
    });
    
    console.log(`uploadChunk: Uploading chunk ${chunkNumber}/${_self.fileInfo.totalChunks - 1} for file ${_self.fileInfo.fileName}`);
    //  "/api/1.1/users/%s/file/%s/chunk"
    let url =
      this.baseUrl +
      '/api/1.1/users/' +
      this.userId +
      '/file/' +
      this.fileInfo.fileToken +
      '/chunk';
    const auth = KoreBotClient.getInstance().getAuthorization();

    axios({
      url,
      data: formData.toString(),
      //contentType: 'multipart/form-data; boundary=' + formData.boundary,
      method: API_CONST.POST,
      headers: {
        Authorization: auth,
        //'User-Agent': agent,
        'Content-Type': 'multipart/form-data; boundary=' + formData.boundary,
        'Cache-Control': 'no-cache',
      },
    })
      .then(function (data) {
        if (_self.isStopLoading) {
          _self.onError('uploadChunk stop loading : ' + _self.file?.id);
          return;
        }
        //console.log('UploadExecutor uploadChunk data ---->:', data);
        _self.currentChunk++;
        if (_self.currentChunk === _self.fileInfo.totalChunks) {
          _self._commitFile();
        } else {
          _self._initChunkUpload();
        }
      })
      .catch(function (error) {
        _self.onError('uploadChunk error --->:' + error);
      });
  };

  _commitFile = () => {
    const _self = this;
    if (_self.isStopLoading) {
      console.log(
        '_commitFile stop loading fileToken :',
        _self.fileInfo.fileToken,
      );
      _self.onError(
        '_commitFile stop loading fileToken :' + _self.fileInfo.fileToken,
      );
      return;
    }

    const auth = KoreBotClient.getInstance().getAuthorization();
    let agent = 'RNApp/1.0';
    try {
      agent = getUserAgent() || 'RNApp/1.0';
    } catch (error) {
      console.log('getUserAgent error:', error);
      agent = 'RNApp/1.0';
    }

    const formData = new MultipartData();
    formData.append('totalChunks', _self.fileInfo.totalChunks + '');
    formData.append('fileToken', _self.fileInfo.fileToken);
    formData.append('fileExtension', _self.fileInfo.fileType);
    formData.append('filename', _self.fileInfo.fileName);
    formData.append('fileContext', _self.fileContext);
    formData.append('thumbnailUpload', 'false'); // Send as string instead of boolean
    formData.append('User-Agent', agent + '');
    
    // Add missing parameters that the server might expect
    formData.append('fileSize', _self.fileInfo.fileSize + '');
    formData.append('fileType', _self.fileInfo.type); // 'image' or 'attachment'
    if (_self.file && _self.file.type) {
      formData.append('fileContentType', _self.file.type); // MIME type like 'image/jpeg'
    }

    let url =
      this.baseUrl +
      '/api/1.1/users/' +
      _self.userId +
      '/file/' +
      _self.fileInfo.fileToken;

    // Add debug logging for the commit request
    console.log('_commitFile: Making commit request', {
      url,
      fileInfo: _self.fileInfo,
      fileContext: _self.fileContext,
      userId: _self.userId,
      originalFile: {
        name: _self.file?.name,
        type: _self.file?.type,
        size: _self.file?.size || _self.file?.fileSize
      },
      formDataFields: {
        totalChunks: _self.fileInfo.totalChunks,
        fileToken: _self.fileInfo.fileToken,
        fileExtension: _self.fileInfo.fileType, // This is the extension being sent
        filename: _self.fileInfo.fileName,
        fileContext: _self.fileContext,
        fileSize: _self.fileInfo.fileSize,
        fileType: _self.fileInfo.type,
        fileContentType: _self.file?.type
      }
    });
    
    console.log('_commitFile: Sending extension to server:', _self.fileInfo.fileType);

    axios({
      url,
      data: formData.toString(),
      method: API_CONST.PUT,
      headers: {
        Authorization: auth,
        'Content-Type': 'multipart/form-data; boundary=' + formData.boundary,
        'Cache-Control': 'no-cache',
      },
    })
      .then(function (data) {
        if (_self.isStopLoading) {
          _self.onError('_commitFile stop loading : ' + _self.file?.id);
          return;
        }
        console.log('_commitFile: Upload successful', data.data);
        const response = {
          type: _self.fileInfo.type,
          fileName: _self.fileInfo.fileName,
          filesize: _self.fileInfo.fileSize,
          fileUrl: data.data,
        };
        // Clear cache after successful upload
        _self.clearFileCache();
        if (_self.onSuccess) _self.onSuccess(response);
      })
      .catch(function (error) {
        // Enhanced error logging
        console.error('_commitFile: Upload failed', {
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          url,
          fileInfo: _self.fileInfo
        });
        
        // Clear cache on error
        _self.clearFileCache();
        _self.onError('_commitFile error: ' + error.message + 
          (error.response?.data ? ' - Server response: ' + JSON.stringify(error.response.data) : ''));
      });
  };
}
export default FileUploadOnprem;
