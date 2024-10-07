import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private meta: Meta) {}

  updateMetaTags(title: string, description: string, keywords: string) {
    this.meta.updateTag({ name: 'title', content: title });
    this.meta.updateTag({ name: 'content', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }
}
