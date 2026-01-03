import type { Document, Schema } from "mongoose";

const deleteAtPath = (obj: Record<string, unknown>, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  if (typeof obj[path[index]] === "object" && obj[path[index]] !== null) {
    deleteAtPath(obj[path[index]] as Record<string, unknown>, path, index + 1);
  }
};

interface ToJSONTransform {
  transform?: (doc: Document, ret: Record<string, unknown>, options: unknown) => unknown;
}

interface SchemaOptions {
  toJSON?: ToJSONTransform;
}

interface PathOptions {
  private?: boolean;
}

const toJSON = (schema: Schema) => {
  type TransformFn = (doc: Document, ret: Record<string, unknown>, options: unknown) => unknown;
  let transform: TransformFn | undefined;
  const options = (schema as { options?: SchemaOptions }).options ?? {};
  if (options.toJSON && typeof options.toJSON.transform === "function") {
    transform = options.toJSON.transform;
  }

  options.toJSON = Object.assign(options.toJSON ?? {}, {
    transform(doc: Document, ret: Record<string, unknown>, options: unknown) {
      Object.keys(schema.paths).forEach((path) => {
        const pathOptions = (schema.paths[path] as { options?: PathOptions }).options;
        if (pathOptions?.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
  (schema as { options?: SchemaOptions }).options = options;
};

export default toJSON;
