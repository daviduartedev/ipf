import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import './PostBody.css';

function linkProps(href) {
  if (!href || !/^https?:\/\//i.test(href)) {
    return {};
  }
  return { target: '_blank', rel: 'noopener noreferrer' };
}

export default function PostBody({ markdown }) {
  return (
    <div className="post-body-md">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children, ...rest }) => (
            <a href={href} {...rest} {...linkProps(href)} className="content-link">
              {children}
            </a>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
