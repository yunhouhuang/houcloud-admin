export function isImg(tag) {
  return tag === 'png' || tag === 'jpg' || tag === 'jpeg' || tag === 'gif' || tag === 'webp';
}
export function isMedia(tag) {
  return tag === 'mp4' || tag === 'avi' || tag === 'fly' || tag === 'm4a' || tag === 'mp3';
}

export function isDoc(tag) {
  return (
    tag === 'doc' ||
    tag === 'docx' ||
    tag === 'xlsx' ||
    tag === 'xls' ||
    tag === 'ppt' ||
    tag === 'pptx' ||
    tag === 'txt'
  );
}

export function isFile(tag) {
  return tag === 'zip' || tag === 'rar';
}
