import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";

const url = `${process.env.BASE_URL}/spaces/${process.env.SPACE_ID}/environments/${process.env.ENVIRONMENT}/entries?access_token=${process.env.ACCESS_TOKEN}&content_type=blog`;

const options = {
  renderText: (text: string) => {
    return text.split('\n').reduce((children: any, textSegment: string, index: number) => {
      return [...children, index > 0 && <br key={index} />, textSegment];
    }, []);
  },
};

export default async function Home() {

  const response = fetch(url, {
    cache: 'no-store'
  });
  const data = await (await response).json()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        data.items.map((item: any, index: number) => {
          const image = data.includes.Asset.find((asset: any) => asset.sys.id === item.fields.image.sys.id);
          const authorEntry = data.includes.Entry.find((entry: any) => entry.sys.id === item.fields.author.sys.id);
          const authorImage = data.includes.Asset.find((image: any) => image.sys.id === authorEntry.fields.authorImage.sys.id);

          return ( 
          <div key={index} className="px-24 mx-auto">
            <h1 className="text-3x1 font-bold py-4">{item.fields.title}</h1>
            <div className="py-4">{documentToReactComponents((item.fields.body), options)}</div>
            <Image src={`https:${image.fields.file.url}`} width={500} height={500} alt={image.fields.file.fileName}/>

            <div className="flex gap-2 mt-10 items-center">
              <Image src={`https:${authorImage.fields.file.url}`} alt={"AuthorPhoto"} width={50} height={50} className="h-16 w-16 rounded-full object-cover"/>
              <h4>{authorEntry.fields.authorName}</h4>
            </div>
          </div>
          );
        })
      }
    </main>
  );
}
