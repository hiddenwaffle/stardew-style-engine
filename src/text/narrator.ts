import { narrationContainer } from 'src/ui/elements';

let lastId = 0;

class Narrator {
  private elementIds: string[];

  constructor() {
    this.elementIds = [];
  }

  start() {
    //
  }

  step() {
    //
  }

  stop() {
    // Nothing right now.
  }

  write(text: string) {
    // Check if given text is same as the last.
    // TODO: If the player walked away from links, it should be caught here.
    let duplicate = false;
    if (this.elementIds.length > 0) {
      const lastElementId = this.elementIds[this.elementIds.length - 1];
      const section = document.getElementById(lastElementId);
      if (section) {
        if (section.innerText === text) {
          duplicate = true;
          {
          // Cancels mid-animation, if applicable.
          // https://stackoverflow.com/a/6303311
          section.style.animation = 'none';
            setTimeout(function() {
              section.style.webkitAnimation = '';
            }, 1);
          }
          if (section.classList.contains('flash')) {
            section.classList.remove('flash');
          }
          // "Flash" the duplicate text https://stackoverflow.com/a/31658367
          section.classList.add('flash');
          section.addEventListener('animationend', () => {
            section.classList.remove('flash');
          });
        }
      }
    }

    if (!duplicate) {
      const section = createSection(text);
      narrationContainer.appendChild(section);
      this.elementIds.push(section.id);
    }
  }
}

export const narrator = new Narrator();

function createSection(text: string): HTMLDivElement {
  const section = document.createElement('div');
  section.id = nextId();
  section.classList.add('ncs');
  section.innerText = text;
  return section;
}

function nextId(): string {
  return `ncs-${lastId++}`;
}
