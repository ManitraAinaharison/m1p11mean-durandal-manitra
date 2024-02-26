import { Component, DestroyRef, OnInit, Renderer2, inject } from '@angular/core';
import { PageLoaderService } from '../../services/page-loader.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.css'
})
export class PageLoaderComponent implements OnInit {

  showLoader: boolean = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private renderer: Renderer2,
    public pageLoaderService: PageLoaderService
  ) {}

  ngOnInit(): void {
    this.pageLoaderService
    .showLoader$
    .subscribe({
      next: (res: boolean) => {
        if (res) {
          this.showLoader = true;
          this.renderer.setStyle(document.body, 'overflow', 'hidden');
        }else {
          this.showLoader = false;
          this.renderer.removeStyle(document.body, 'overflow');
        }
      }
    })
  }
}
