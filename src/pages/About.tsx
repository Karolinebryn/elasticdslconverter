import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Github, Bug, GitPullRequest, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GITHUB_URL = "https://github.com/Karolinebryn/elasticdslconverter";
const SITE_URL = "https://elasticdslconverter.lovable.app";

const FAQS: { question: string; answer: string }[] = [
  {
    question: "What does the Elastic DSL Converter do?",
    answer:
      "It takes any Elasticsearch Query DSL request (the JSON you'd send to _search or _count) and translates it into strongly-typed C# code using the official Elastic.Clients.Elasticsearch .NET client. The output is a complete, compilable file with an async wrapper you can drop straight into your project.",
  },
  {
    question: "Which versions of Elasticsearch and the .NET client are supported?",
    answer:
      "Both 8.x and 9.x of Elasticsearch and the matching Elastic.Clients.Elasticsearch .NET client. Pick the target version in the UI before translating and the prompt switches to the correct API surface.",
  },
  {
    question: "How do I migrate from NEST to Elastic.Clients.Elasticsearch?",
    answer:
      "NEST is deprecated in favour of Elastic.Clients.Elasticsearch from 8.x onwards. The fastest path is to take your existing JSON queries (or the JSON NEST was producing) and run them through this converter to get the equivalent fluent C# in the new client. From there you only need to wire up your own ElasticsearchClient and document types.",
  },
  {
    question: "Can I dynamically build queries with lists of values?",
    answer:
      "Yes. Paste your DSL with the dynamic part included (for example a should clause with multiple terms) and the converter produces fluent C# you can adapt — typically by replacing the inline list with a variable and projecting it into the Terms or Should builder.",
  },
  {
    question: "How do I combine multiple must, should, and must_not clauses?",
    answer:
      "In the new client you build a BoolQuery and pass arrays of Query objects to Must, Should, and MustNot. The converter generates this structure for you whenever your DSL contains a bool query, including nested combinations.",
  },
  {
    question: "Is the tool free and open source?",
    answer:
      "Yes. The Elastic DSL Converter is MIT licensed and the source is on GitHub. Bug reports, wrong-translation examples, and pull requests are all welcome.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About — Elasticsearch Query DSL to C# Converter | Elastic.Clients.Elasticsearch</title>
        <meta
          name="description"
          content="About the Elasticsearch Query DSL to C# converter — a free, open-source tool for Elasticsearch C# developers using the Elastic.Clients.Elasticsearch .NET client (8.x/9.x)."
        />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title" content="About — Elasticsearch Query DSL to C# Converter" />
        <meta
          property="og:description"
          content="Free, open-source converter from Elasticsearch Query DSL to Elasticsearch C# for the Elastic.Clients.Elasticsearch .NET client."
        />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            About the Elasticsearch Query DSL to C# Converter
          </h1>
          <p className="text-muted-foreground">
            How this tool helps developers translate Elasticsearch Query DSL into Elasticsearch C# for the
            <span className="font-mono"> Elastic.Clients.Elasticsearch</span> .NET client.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>What does the Elasticsearch Query DSL to C# converter do?</CardTitle>
            <CardDescription>
              A free, open-source converter for Elasticsearch C# developers working with the .NET client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground/90 leading-relaxed">
            <p>
              The Elastic DSL Converter takes any Elasticsearch Query DSL request — the JSON you'd normally send to{" "}
              <code className="font-mono text-primary">_search</code> or{" "}
              <code className="font-mono text-primary">_count</code> — and translates it into strongly-typed
              Elasticsearch C# code using the official{" "}
              <code className="font-mono text-primary">Elastic.Clients.Elasticsearch</code> client.
            </p>
            <p>
              It supports both 8.x and 9.x versions of Elasticsearch and the{" "}
              <code className="font-mono text-primary">Elastic.Clients.Elasticsearch</code> .NET client, and produces a
              complete, compilable file with an async wrapper so you can drop the result straight into your project.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Elasticsearch C# FAQ — Query DSL & Elastic.Clients.Elasticsearch</CardTitle>
            <CardDescription>
              Common questions developers ask about translating Elasticsearch Query DSL into C# for the .NET client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={faq.question} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-foreground/90 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
