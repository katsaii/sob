const sobHTMLSanitiseString = (html) => html
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#039;");

const SobHTMLBuilder = class {
    constructor() { this.text = "" }
    toString() { return this.text }
    write(text) { this.text += text }

    writeTag(tags, content=undefined) {
        const tagsOpen = Array.isArray(tags) ? tags : [tags];
        const tagsClose = tagsOpen.map(tag => tag.split()[0]);
        for (const tag of tagsOpen) {
            this.text += `<${tag}>`;
        }
        if (content != undefined) {
            if (content instanceof Function) {
                content(this);
            } else {
                this.write(content);
            }
        }
        for (const tag of tagsClose) {
            const tagWithoutAttrs = tag.split()[0];
            this.text += `</${tagWithoutAttrs}>`;
        }
    }

    writeVoidTag(tags) {
        const tagsOpen = Array.isArray(tags) ? tags : [tags];
        for (const tag of tagsOpen) {
            this.text += `<${tag} />`;
        }
    }

    writeResult(title, content) {
        this.writeTag("div", (sb) => {
            sb.writeTag("b", title);
            sb.write(" → ");
            sb.writeTag("code", content);
        });
    }

    writeResultRichText(title, content) {
        this.writeTag("div", (sb) => {
            sb.writeTag("b", title);
            sb.write(" ⤵");
            sb.writeVoidTag("br");
            sb.writeTag("textarea cols=\"80\" rows=\"5\"", content);
        });
    }

    writeResultDownload(filename, data) {
        const url = URL.createObjectURL(data);
        this.writeTag(`a href=\"${url}\" download=\"${filename}\"`, (sb) => {
            sb.write("(download)");
        })
    }

    writeAudio(url, type = "audio/wav") {
        this.writeTag("audio controls controlslist=\"noplaybackrate\"", (sb) => {
            sb.writeVoidTag(`source src="${url}" type="${type}"`);
        });
    }
};