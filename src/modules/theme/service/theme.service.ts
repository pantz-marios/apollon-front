import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme } from './theme.model';
import { LIGHT_THEME } from '../themes/light.theme';
import { DARK_THEME } from '../themes/dark.theme';





@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly availableThemes: Theme[] = [LIGHT_THEME, DARK_THEME];
  private activeThemeObserved: BehaviorSubject<Theme> = new BehaviorSubject(null);
  private activeThemeObservable: Observable<Theme> = this.activeThemeObserved.asObservable();



  public setTheme(themeName: string) {
    if(themeName == null) {
      return;
    }

    const matchedThemes = this.availableThemes.filter((theme) => theme.name === themeName);
    const newTheme = matchedThemes.length > 0 ? matchedThemes[0] : null;
    if(newTheme == null) {
      return;
    }

    for(const [property, value] of Object.entries(newTheme.properties)) {
      document.documentElement.style.setProperty(property, value);
    }

    this.activeThemeObserved.next(newTheme);
  }

  public getActiveThemeObservable(): Observable<Theme> {
    return this.activeThemeObservable;
  }

  public getActiveTheme(): Theme {
    return this.activeThemeObserved.getValue();
  }

}
