function TrendingRepos({ repos }) {
  return (
    <div className="trending-repos">
      <h2>Top GitHub Repos</h2>
      <div className='repo-list'>
        {repos.map((repo) => (
          <div key={repo.id} className="repo-card">{repo.name}</div>
        ))}
      </div>
    </div>
  );
}

export default TrendingRepos;
/*
<ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            {/* <div>
            <img src={repo.owner.avatar_url}> avatar</img>
            </div>
              {repo.stargazers_count}
              {repo.forks_count}
              {repo.open_issues_count}
              {repo.language}
              {repo.created_at}
              {repo.updated_at}
              {repo.description}
            <a href={repo.html_url} target='_blank' rel='noopener noreferrer'>
              
            </a>
          </li>
      </ul>
*/
