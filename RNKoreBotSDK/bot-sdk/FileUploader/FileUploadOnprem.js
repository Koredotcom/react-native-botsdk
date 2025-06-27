import API_CONST from '../lib/services/api-constants';
//import RNFS from 'react-native-fs';
import MultipartData from './MultipartData';
import axios from 'axios';
import {isAndroid, isIOS} from '../utils/PlatformCheck';
import KoreBotClient from 'rn-kore-bot-socket-lib';
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
    this.CHUNK_SIZE = 512 * 1024; // 512KB instead of 1MB

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
  };

  _processFile = () => {
    if (this.file && this.file.name) {
      //console.log('File is', this.file);
      // Handle both 'size' and 'fileSize' properties from different file sources
      const fileSize = this.file.size || this.file.fileSize || 0;
      console.log('FileUploadOnprem: File size determined as:', fileSize, 'from file object:', {
        size: this.file.size,
        fileSize: this.file.fileSize
      });
      
      this.fileInfo = {
        fileName: this.file.name,
        fileType: this.file.name.split('.').pop()?.toLowerCase() || 'unknown',
        fileSize: fileSize,
        type: this.file.type,
        isChunkUpload: true,
      };

      this.fileInfo.totalChunks = this.fileInfo.isChunkUpload
        ? Math.floor(this.fileInfo.fileSize / this.CHUNK_SIZE) + 1
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
    const fileSize = this.file.size || this.file.fileSize || 0;
    const end =
      this.currentChunk === totalChunks - 1
        ? Math.floor(fileSize)
        : Math.floor((this.currentChunk + 1) * chunkSize);

    // Calculate the actual length to read (don't exceed file size)
    const actualLength = Math.min(chunkSize, Math.floor(fileSize) - start);

    const progress = Math.floor(((this.currentChunk + 1) / totalChunks) * 100);
    this.onProgress(progress);
    if (_self.currentChunk === totalChunks) {
      return;
    }
    this.readChunkData(this.file?.path || this.file?.uri, actualLength, start)
      .then(chunk => {
        if (chunk) {
          this.uploadChunk(chunk, this.currentChunk);
        }
      })
      .catch(error => {
        console.log('readChunkData error --->:', error);
      });
  };

  readChunkData = (filePath, length, position) => {
    let RNFS = null;
    if (isAndroid || isIOS) {
      RNFS = require('react-native-fs');
    }
    // Ensure length and position are integers for native iOS compatibility
    const lengthInt = Math.floor(Number(length));
    const positionInt = Math.floor(Number(position));
    
    // Safety checks
    if (lengthInt <= 0) {
      console.log('readChunkData: Invalid length', lengthInt);
      return Promise.reject(new Error('Invalid read length'));
    }
    if (positionInt < 0) {
      console.log('readChunkData: Invalid position', positionInt);
      return Promise.reject(new Error('Invalid read position'));
    }
    
    // Ensure values are within safe NSInteger range for iOS (32-bit safe)
    const MAX_SAFE_INT = 2147483647; // 2^31 - 1
    if (lengthInt > MAX_SAFE_INT || positionInt > MAX_SAFE_INT) {
      console.log('readChunkData: Values exceed safe NSInteger range', {lengthInt, positionInt});
      return Promise.reject(new Error('Values exceed safe integer range'));
    }
    
    console.log(`readChunkData: Reading ${lengthInt} bytes from position ${positionInt}`);
    return RNFS?.read?.(decodeURI(filePath), lengthInt, positionInt, 'base64');
  };
  uploadChunk = (chunk, chunkNumber) => {
    const _self = this;
    if (_self.isStopLoading) {
      _self.onError('uploadChunk stop loading : ' + _self.file?.id);
      return;
    }

    chunkNumber = chunkNumber++;
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
    formData.append('thumbnailUpload', false);
    formData.append('User-Agent', agent + '');

    let url =
      this.baseUrl +
      '/api/1.1/users/' +
      _self.userId +
      '/file/' +
      _self.fileInfo.fileToken;

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
        const response = {
          type: _self.fileInfo.type,
          fileName: _self.fileInfo.fileName,
          filesize: _self.fileInfo.fileSize,
          fileUrl: data.data,
        };
        if (_self.onSuccess) _self.onSuccess(response);
      })
      .catch(function (error) {
        _self.onError('_commitFile error :' + error);
      });
  };
}
export default FileUploadOnprem;
