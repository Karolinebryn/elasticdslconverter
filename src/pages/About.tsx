import { Link } from "react-router-dom";
import { Github, Bug, GitPullRequest, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const GITHUB_URL = "https://github.com/Karolinebryn/elasticdslconverter";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to translator
            </Link>
          </Button>
        </div>

        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">About</h1>
          <p className="text-muted-foreground">Learn more about the Elastic DSL Converter and how to get involved.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>What is this tool?</CardTitle>
            <CardDescription>
              A free, open-source converter for Elasticsearch developers working in .NET.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground/90 leading-relaxed">
            <p>
              The Elastic DSL Converter takes any Elasticsearch Query DSL request — the JSON you'd normally send to{" "}
              <code className="font-mono text-primary">_search</code> or{" "}
              <code className="font-mono text-primary">_count</code> — and translates it into strongly-typed C# code
              using the official <code className="font-mono text-primary">Elastic.Clients.Elasticsearch</code> client.
            </p>
            <p>
              It supports both 8.x and 9.x versions of Elasticsearch and the .NET client, and produces a complete,
              compilable file with an async wrapper so you can drop the result straight into your project.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Open source on GitHub
            </CardTitle>
            <CardDescription>Contributions and issue reports are very welcome.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground/90 leading-relaxed">
            <p>
              This project is MIT licensed and developed in the open. If you spot a wrong translation, hit a bug, or
              have an idea for a new feature, please get involved — every issue and pull request helps make the
              converter better for everyone.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Bug className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>
                  <strong>Found a bug or wrong translation?</strong> Open an issue with the input DSL, the produced C#,
                  and what you expected instead.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <GitPullRequest className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>
                  <strong>Want to contribute a fix?</strong> Pull requests are welcome — small improvements and new
                  few-shot examples are especially appreciated.
                </span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`${GITHUB_URL}/issues/new`} target="_blank" rel="noopener noreferrer">
                  <Bug className="w-4 h-4" />
                  Report an issue
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
