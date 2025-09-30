import fs from "fs";
import Handlebars from "handlebars";

export const renderTemplate = (templatePath: string, values: Record<string, any>) => {
    const templateContent = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateContent);
    return JSON.parse(template(values));
}
