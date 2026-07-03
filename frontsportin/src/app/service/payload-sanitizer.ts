import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PayloadSanitizerService {
  sanitize<T>(
    payload: T,
    config?: {
      booleanFields?: string[];
      nestedIdFields?: string[];
      idFieldMap?: { [nestedField: string]: string };
      removeFields?: string[];
    },
  ): T {
    const copy: Record<string, unknown> = { ...payload } as Record<string, unknown>;

    if (config?.booleanFields) {
      config.booleanFields.forEach((field) => {
        if (copy[field] === 1 || copy[field] === 0) {
          copy[field] = copy[field] === 1;
        } else {
          copy[field] = !!copy[field];
        }
      });
    }

    if (config?.nestedIdFields) {
      config.nestedIdFields.forEach((field) => {
        if (copy[field] && typeof copy[field] === 'object') {
          copy[field] = { id: Number((copy[field] as Record<string, unknown>)['id']) };
        } else {
          const idKey = `id_${field}`;
          if (copy[idKey] !== undefined) {
            copy[field] = { id: Number(copy[idKey]) };
            delete copy[idKey];
          }
        }
      });
    }

    if (config?.idFieldMap) {
      Object.keys(config.idFieldMap).forEach((nestedField) => {
        const idKey = config.idFieldMap![nestedField];
        if (copy[nestedField] && typeof copy[nestedField] === 'object') {
          copy[nestedField] = { id: Number((copy[nestedField] as Record<string, unknown>)['id']) };
        } else if (copy[idKey] !== undefined) {
          copy[nestedField] = { id: Number(copy[idKey]) };
          delete copy[idKey];
        }
      });
    }

    if (config?.removeFields) {
      config.removeFields.forEach((fieldPath) => {
        if (!fieldPath) return;
        const parts = fieldPath.split('.');
        if (parts.length === 1) {
          delete copy[parts[0]];
        } else {
          let target: Record<string, unknown> | null = copy;
          for (let i = 0; i < parts.length - 1; i++) {
            if (target && typeof target === 'object' && parts[i] in target) {
              target = target[parts[i]] as Record<string, unknown>;
            } else {
              target = null;
              break;
            }
          }
          if (target && typeof target === 'object') {
            delete target[parts[parts.length - 1]];
          }
        }
      });
    }

    return copy as T;
  }
}
