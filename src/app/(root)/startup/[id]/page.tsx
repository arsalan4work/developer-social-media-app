import { formatDate } from '@/lib/utils'; 
import { client } from '@/sanity/lib/client';
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import markdownit from "markdown-it"
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import StartupCard, { StartupTypeCard } from '@/components/StartupCard';

const md = markdownit();

export const experimental_ppr = true;

const page = async ({ params }: { params: { id: string } }) => {
   const { id } = params;

   const [post, editorPostsData] = await Promise.all([
      client.fetch(STARTUP_BY_ID_QUERY, { id }),
      client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editors-picks-new' })
   ]);

   if (!post) return notFound();

   // Extract editor posts safely
   const editorPosts = (editorPostsData?.select || [])as unknown as StartupTypeCard[];

   const parsedContent = md.render(post?.pitch || "");

   return (
      <>
         {/* Page Heading */}
         <section className='pink_container !min-h-[230px]'>
            <p className='tag'>{formatDate(post?._createdAt)}</p>
            <h1 className='heading'>{post.title}</h1>
            <p className='sub-heading !max-w-5xl'> {post.description}</p>
         </section>

         {/* Main Section Post */}
         <section className='section_container'>
            <Image
               src={post?.image || "/fallback-image.jpg"}
               alt='Not Found!'
               width={500}
               height={500}
               className='w-full h-auto rounded-xl'
            />
            <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
               <div className='flex-Between gap-5'>
                  <Link href={`user/${post.author?._id}`} className='flex gap-2 items-center mt-3'>
                     <Image
                        src={post.author?.image || "/fallback-avatar.jpg"}
                        alt='Not Found!'
                        width={64}
                        height={64}
                        className='rounded-full drop-shadow-lg'
                     />
                     <div>
                        <p className='text-20-medium'>{post.author?.name || "Unknown Author"}</p>
                        <p className='text-16-medium !text-black-300'>@{post.author?.username || "unknown"}</p>
                     </div>
                  </Link>
                  <p className='category-tag'>{post.category}</p>
               </div>

               <h3 className='text-30-bold'>Pitch Details</h3>
               {parsedContent ? (
                  <article 
                     className='prose max-w-4xl font-work-sans break-all'
                     dangerouslySetInnerHTML={{ __html: parsedContent }}
                  />
               ) : (
                  <p className='no-result'> No Details Provided</p>
               )}
            </div>
            <hr className='divider'/>

            {/* Editor Picks Section */}
            {editorPosts.length > 0 && (
               <div className='max-w-4xl mx-auto'>
                  <p className='text-30-semibold'>Editor Picks</p>
                  <ul className='mt-7 card_grid-sm'>
                     {editorPosts.map((post, i) => (
                        <StartupCard key={i} post={post} />
                     ))}
                  </ul>
               </div>
            )}
         </section>

         {/* View Component */}
         <Suspense fallback={<Skeleton className='view_skeleton'/>}>
            <View id={id}/>
         </Suspense>
      </>
   )
}

export default page;
