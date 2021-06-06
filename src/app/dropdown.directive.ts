import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective implements AfterViewInit {
  isOpen: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    setTimeout(() => {
      let part = this.el.nativeElement.querySelector(
        '.nav-item-dropdown-contents'
      );
      let arrows = this.el.nativeElement.querySelector('.arrows');

      if (part.classList.contains('expanded-child')) {
        this.isOpen = true;
        this.renderer.setProperty(
          arrows,
          'innerHTML',
          '<i class="fas fa-chevron-up"></i>'
        );
      } else {
        this.isOpen = false;
        this.renderer.setProperty(
          arrows,
          'innerHTML',
          '<i class="fas fa-chevron-down"></i>'
        );
      }
    }, 0);
  }

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
    let part = this.el.nativeElement.querySelector(
      '.nav-item-dropdown-contents'
    );

    let arrows = this.el.nativeElement.querySelector('.arrows');
    if (this.isOpen) {
      this.renderer.removeClass(part, 'collapsed-child');
      this.renderer.addClass(part, 'expanded-child');
      this.renderer.setProperty(
        arrows,
        'innerHTML',
        '<i class="fas fa-chevron-up"></i>'
      );
    } else {
      this.renderer.removeClass(part, 'expanded-child');
      this.renderer.addClass(part, 'collapsed-child');
      this.renderer.setProperty(
        arrows,
        'innerHTML',
        '<i class="fas fa-chevron-down"></i>'
      );
    }
  }
}
