import { useEffect, useRef } from "react";

const youtubeRegex = /^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?$/;
export function parseYoutube(inputText: string): string | null {
  const results = youtubeRegex.exec(inputText);
  if (results) {
    return results[1];
  }
  return null;
}

function linkify(inputText: string): string {
  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
}

export default function useLinkifyUrls() {
  const textContainerRef = useRef(null);

  useEffect(() => {
    const text = textContainerRef.current.innerHTML;
    if (textContainerRef.current) {
      textContainerRef.current.innerHTML = linkify(text);
    }
  }, []);

  return textContainerRef;
}