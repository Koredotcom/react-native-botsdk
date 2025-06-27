class MultipartData {
  constructor(props) {
    this.boundary = '--------MultipartData' + Math.random();
    this.fields = [];
  }

  append(key, value) {
    this.fields.push([key, value]);
  }

  toString() {
    var boundary = this.boundary;
    var body = '';
    this.fields.forEach(field => {
      body += '--' + boundary + '\r\n';
      // file upload
      if (field[1]?.data) {
        var file = field[1];
        if (file.fileName) {
          body +=
            'Content-Disposition: form-data; name="' +
            field[0] +
            '"; filename="' +
            file.fileName +
            '"';
        } else {
          body += 'Content-Disposition: form-data; name="' + field[0] + '"';
        }
        body += '\r\n';
        if (file.type) {
          body += 'Content-Type: UTF-8; charset=ISO-8859-1\r\n';
        }
        body += 'Content-Transfer-Encoding: base64\r\n';
        body += '\r\n' + file.data + '\r\n'; //base64 data
      } else {
        body +=
          'Content-Disposition: form-data; name="' + field[0] + '";\r\n\r\n';
        body += field[1] + '\r\n';
      }
    });
    body += '--' + boundary + '--';
    return body;
  }
}

export default MultipartData;
