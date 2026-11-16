import { File, Directory, Paths } from "expo-file-system";

function folder() {
  const dir = new Directory(Paths.document, "products");
  dir.create({ idempotent: true });
  return dir;
}

export function list() {
  return folder().list().filter(f => f.name.endsWith(".json"))
    .map(f => JSON.parse(f.textSync())).sort((a,b) => b.id.localeCompare(a.id));
}

export function imageUri(name) {
  return name ? new File(folder(), name).uri : undefined;
}

export async function save(product, image) {
  const dir = folder();
  let copy;
  try {
    if (image) {
      const ext = image.name.match(/\.[a-z0-9]+$/i)?.[0] ?? ".img";
      copy = new File(dir, product.id + "-photo" + ext);
      await image.copy(copy);
      product.imageUrl = copy.name;
    }
    const temp = new File(dir, product.id + ".tmp");
    temp.create({ overwrite: true });
    await temp.write(JSON.stringify(product));
    await temp.move(new File(dir, product.id + ".json"), { overwrite: true });
  } catch (err) {
    if (copy?.exists) copy.delete();
    throw err;
  }
}
