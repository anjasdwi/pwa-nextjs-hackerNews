import fetch from 'isomorphic-fetch';
import Error from 'next/error';
import StoryList from '../components/StoryList'
import Layout from '../components/Layout'
import Link from 'next/link';

class Index extends React.Component {
  static async getInitialProps({ req, res, query }){
    let stories;
    let page;

    try {
      page = Number(query.page) || 1
      const response = await fetch(`https://node-hnapi.herokuapp.com/news?page=${page}`);
      stories = await response.json();
    } catch (err) {
      console.log(err);
      stories = [];
    }
    return {page, stories}; 
  }

  componentDidMount(){
    if("serviceWorker" in navigator) {
      navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('Service worker registrtion successful',
        registration);
      })
      .catch(err => {
        console.warn('service worker registration failed', err.message);
      })
    }
  }

  render() {
    const { stories, page } = this.props;

    if (stories.length === 0) {
      return <Error statusCode={503} />
    }
    return (
      <Layout title="Hacker News" description="A hacker news clone made with next.js">
        <StoryList stories={stories} />
        <footer>
          <Link href={`/?page=${page + 1}`}>
            <a>Next Page ({page + 1})</a>
          </Link>
        </footer>
      </Layout>
       
     )
  }
}

export default Index;