import FileUploadOnprem from './FileUploadOnprem';
import KoraBotClient from 'rn-kore-bot-socket-lib';
import {FILE_CONTEXT} from '../constants/Constant';

class FileUploadQueue {
  private uploadQueue: string[];
  private isUploading: boolean;
  private callback: (results: any) => void;
  private count: number;
  private remainCount: number;
  private progress: any;
  private uploadQueueObj: any[];
  constructor(
    callback: (results: any) => void,
    progress: (value: any) => void,
  ) {
    this.uploadQueue = [];
    this.isUploading = false;
    this.callback = callback;
    this.count = 0;
    this.remainCount = 0;
    this.progress = progress;
    this.uploadQueueObj = [];
  }

  public addToQueue(file: any) {
    this.count = this.count + 1;
    this.uploadQueue.push(file);

    // If not currently uploading, start the process
    if (!this.isUploading) {
      this.uploadNext();
    }
  }

  public removeFromQueue(file: any) {
    this.uploadQueue = this.uploadQueue.filter(
      (data: any) => data?.id !== file?.id,
    );

    let obj = this.uploadQueueObj.filter((data: any) => data.id === file?.id);

    if (obj && obj?.[0]) {
      let uploader: FileUploadOnprem = obj[0]?.uploader;
      uploader.stopLoading();
      // uploader = undefined;
    }
  }

  private async uploadNext() {
    if (this.uploadQueue.length > 0) {
      const file = this.uploadQueue.shift();
      this.remainCount = this.remainCount + 1;
      this.isUploading = true;

      try {
        // Call your function to upload the file here
        await this.uploadFile(file);

        // Continue with the next file in the queue
        this.uploadNext();
      } catch (error) {
        console.log('File upload failed:', error);
        // Handle the error, and you might want to retry or skip to the next file
        this.uploadNext();
      }
    } else {
      // No more files to upload
      this.isUploading = false;
    }
  }

  private sendSignal(result: any) {
    // if (this.callback && this.result?.length === this.count) {
    this.callback(result);
    //}
  }
  private async uploadFile(file: any) {
    const uploader = new FileUploadOnprem(
      file,
      KoraBotClient.getInstance().getUserId(),
      FILE_CONTEXT,
      KoraBotClient.getInstance().getAccessToken(),
    );

    this.uploadQueueObj.push({id: file?.id, uploader: uploader});

    uploader.start(
      (progress: any) => {
        this.progress?.({
          progress: progress,
          id: file?.id,
        });
      },
      (success: any) => {
        let modifiedResult: any = {
          ...success,
          uri: file?.uri,
          ...file,
          status: true,
        };
        this.sendSignal(modifiedResult);
      },
      (onError: any) => {
        console.log('error in file upload', onError);
        let item = {status: false};
        this.sendSignal(item);
      },
    );
    return uploader;
  }
}

export default FileUploadQueue;
