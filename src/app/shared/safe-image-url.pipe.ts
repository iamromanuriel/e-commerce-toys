import { Pipe, PipeTransform } from '@angular/core';
import { trustedHttpImageUrl } from '../utils/url-security';

@Pipe({
  name: 'safeImageUrl',
  standalone: true,
})
export class SafeImageUrlPipe implements PipeTransform {
  transform(url: string | undefined | null): string {
    return trustedHttpImageUrl(url);
  }
}
