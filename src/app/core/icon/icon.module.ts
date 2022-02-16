import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import icons from '../../../assets/jsons/icons.json';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class IconModule {
  private path = '../assets/icons';
  iconsArray: any = icons;

  constructor(
    private  domSanitizer: DomSanitizer,
    public  matIconRegistry: MatIconRegistry
  ) {
    this.iconsArray.forEach((icon: any) => {
      this.matIconRegistry.addSvgIcon(icon.name, this.setPath(`${this.path}/${icon.src}.svg`));

      
    });
  }

  private setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
