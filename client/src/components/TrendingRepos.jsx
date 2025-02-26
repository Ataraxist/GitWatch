import { Telescope, GitFork, Bug, Languages } from 'lucide-react';

function TrendingRepos({ repos }) {
  return (
    <div className='repo-list'>
      {repos.map((repo, index) => (
        <div key={repo.id} className='card-box'>
          <div className='ext-stuff'>{`#${index + 1}`}</div>
          <div className='repo-card'>
            <div className='repo-summary'>
              <h3>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repo.name}
                </a>
              </h3>
              <p className='repo-owner'>
                By{' '}
                <a
                  href={repo.owner.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repo.owner.login}
                </a>
              </p>
              <p className='repo-description'>{repo.description}</p>
            </div>
            <div className='repo-stats'>
              <div className='stat-tile' title='Stargazers'>
                <Telescope size='3.8vh' className='stat-badge' />{' '}
                {repo.stargazers_count}
              </div>
              <div className='stat-tile' title='Forks'>
                <GitFork size='3.8vh' className='stat-badge' />{' '}
                {repo.forks_count}
              </div>
              <div className='stat-tile' title='Open Issues'>
                <Bug size='3.8vh' className='stat-badge' />{' '}
                {repo.open_issues_count}
              </div>
              <div className='stat-tile' title='Primary Language'>
                <Languages size='3.8vh' className='stat-badge' />{' '}
                {repo.language || '?'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrendingRepos;
