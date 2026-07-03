import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITemporada } from '../model/temporada';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';
import { PayloadSanitizerService } from './payload-sanitizer';
import { IClub } from '../model/club';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root',
})
export class TemporadaService {
  constructor(
    private oHttp: HttpClient,
    private sanitizer: PayloadSanitizerService,
    private security: SecurityService,
  ) {}

  get(id: number): Observable<ITemporada> {
    return this.oHttp.get<ITemporada>(`${serverURL}/temporada/${id}`);
  }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = '',
    id_club: number = 0,
  ): Observable<IPage<ITemporada>> {
    // club admins may only see their own club
    id_club = this.security.clubFilter(id_club);
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    // Agregar ID como criterio secundario de ordenamiento
    const sortParams =
      order === 'id' ? `${order},${direction}` : `${order},${direction}&sort=id,asc`;

    if (id_club > 0) {
      return this.oHttp.get<IPage<ITemporada>>(
        serverURL + `/temporada?page=${page}&size=${rpp}&sort=${sortParams}&id_club=${id_club}`,
      );
    }

    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<ITemporada>>(
        serverURL +
          `/temporada?page=${page}&size=${rpp}&sort=${sortParams}&descripcion=${descripcion}`,
      );
    }

    return this.oHttp.get<IPage<ITemporada>>(
      serverURL + `/temporada?page=${page}&size=${rpp}&sort=${sortParams}`,
    );
  }

  update(temporada: Partial<ITemporada> & { club?: Partial<IClub> }): Observable<ITemporada> {
    if (this.security.isClubAdmin()) {
      const myClubId = this.security.getClubId();
      temporada.club = { id: myClubId } as IClub;
      this.security.ensureClubOwnership(myClubId);
    } else {
      this.security.ensureClubOwnership(temporada.club?.id);
    }
    const body = this.sanitizer.sanitize(temporada, { nestedIdFields: ['club'], removeFields: ['categorias'] });
    return this.oHttp.put<ITemporada>(`${serverURL}/temporada`, body);
  }

  create(temporada: Partial<ITemporada> & { club?: Partial<IClub> }): Observable<ITemporada> {
    if (this.security.isClubAdmin()) {
      // for club admin force club id to user's club
      const clubId = this.security.getClubId();
      if (clubId != null) {
        // casting because Partial<IClub> still allows just id but AOT complains
        temporada.club = { id: clubId } as IClub;
      }
    }
    const body = this.sanitizer.sanitize(temporada, { nestedIdFields: ['club'], removeFields: ['categorias'] });
    return this.oHttp.post<ITemporada>(`${serverURL}/temporada`, body);
  }


  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/temporada/count');
  }

  delete(id: number): Observable<number> {
    // server side should enforce but we can optionally forbid or check
    if (this.security.isClubAdmin()) {
      // optimistic: no club check here as id-only; backend must validate
    }
    return this.oHttp.delete<number>(serverURL + '/temporada/' + id);
  }


}
