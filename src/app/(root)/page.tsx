import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { authID } from "../../../auth"; // Ensure this import is correct

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  // Get the search query parameter
  const query = (await searchParams).query;
  const params = { search: query || null };

  // Authenticate the session
  let session;
  try {
    session = await authID(); // Get the session
    console.log(session?.id); // Log the session id for debugging
  } catch (error) {
    console.error("Error fetching session:", error);
  }

  // Fetch the posts from Sanity
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <>
      {/* Headings, Paragraph, and Search Bar */}
      <section className="pink_container">
        <h2 className="text-2xl">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h2>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      {/* Cards */}
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post) => (
              <StartupCard key={post?._id} post={post as StartupTypeCard} /> // Type assertion here
            ))
          ) : (
            <p className="no-results"> No Startups Found!</p>
          )}
        </ul>
      </section>

      {/* Live Sanity Data */}
      <SanityLive />
    </>
  );
}
