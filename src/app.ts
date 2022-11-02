import { ToDoComponent } from "./components/page/item/todo.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { PageComponent, PageItemComponent } from "./components/page/page.js";
import { VideoComponent } from "./components/page/item/video.js";
import { InputDialog } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";

interface SectionInput {
  new (): MediaSectionInput | TextSectionInput;
}

class App {
  pageComponent: PageComponent;

  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.pageComponent = new PageComponent(PageItemComponent);
    this.pageComponent.attachTo(appRoot);

    this.pageComponent.addChild(
      new VideoComponent("비디오1", "https://www.youtube.com/embed/tzIzcr4EM6w")
    );
    this.pageComponent.addChild(
      new ImageComponent("이미지1", "https://picsum.photos/800/400.jpg")
    );
    this.pageComponent.addChild(new NoteComponent("asd", "zzz"))
    this.pageComponent.addChild(new ToDoComponent('zzz', 'qwe'))

    this.makeNewElement("#new-image", MediaSectionInput);
    this.makeNewElement("#new-video", MediaSectionInput);
    this.makeNewElement("#new-note", TextSectionInput);
    this.makeNewElement("#new-todo", TextSectionInput);
  }

  makeNewElement(selector: string, InputComponentConstructor: SectionInput) {
    const button = document.querySelector(selector)! as HTMLButtonElement;
    button.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new InputComponentConstructor();

      dialog.addChild(inputSection);
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        if ("url" in inputSection && selector === "#new-image") {
          const image = new ImageComponent(
            inputSection.title,
            inputSection.url
          );
          this.pageComponent.addChild(image);
          dialog.removeFrom(this.dialogRoot);
        }
        if ("url" in inputSection && selector === "#new-video") {
          const video = new VideoComponent(
            inputSection.title,
            inputSection.url
          );
          this.pageComponent.addChild(video);
          dialog.removeFrom(this.dialogRoot);
        }
        if ("body" in inputSection && selector === "#new-note") {
          const note = new NoteComponent(inputSection.title, inputSection.body);
          this.pageComponent.addChild(note);
          dialog.removeFrom(this.dialogRoot);
        }
        if ("body" in inputSection && selector === "#new-todo") {
          const note = new ToDoComponent(inputSection.title, inputSection.body);
          this.pageComponent.addChild(note);
          dialog.removeFrom(this.dialogRoot);
        }
      });
    });
  }
}

new App(document.querySelector(".document")!, document.body);
