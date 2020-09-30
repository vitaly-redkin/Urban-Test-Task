/**
 * Enhances encodeURIComponent by encoding !'()* characters.
 *
 * @param str string to encode for URI
 */
export function fixedEncodeURIComponent(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
