export default class Template {
  public static replacePlaceholder(
    template: string,
    placeholder: string,
    replacement: string
  ) {
    let result = template;

    const regex = new RegExp(`{{${placeholder}}}`, "g");

    result = result.replace(regex, replacement);

    return result;
  }
}
