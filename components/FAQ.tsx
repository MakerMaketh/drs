import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function getTaxOnProfit(
    useDefaultTax: boolean = true,
    actualProfit: number = 0.95,
    expectedProfit: number = 1
): number {
    if (useDefaultTax) return +(process.env.NEXT_PUBLIC_TAX_PERCENT ?? 5);
    const taxPercent = ((expectedProfit - actualProfit) / expectedProfit) * 100;
    return +taxPercent.toFixed(4);
}

const faqs = [
    {
        question: `What are the ${getTaxOnProfit()}% fees for?`,
        answer: `${getTaxOnProfit() / 2}% is allocated to the weekly leaderboard, rewarding players with the biggest wagers, winners and losers. The remaining ${getTaxOnProfit() / 2}% is used for buybacks and burns of the $DRS token, helping to reduce supply and make it deflationary.`
    },
    {
        question: "Why can't I bet on single numbers?",
        answer: "The betting options in Degen Roulette Spin are designed to increase win probabilities while promoting stability in the $DRS ecosystem. Drawing inspiration from games like Degen Coin Flip with its straightforward double-or-nothing concept, we wanted to keep things simple yet engaging. Our format allows for up to 2.925x returns, with no single number bets."
    },
    {
        question: "How do you ensure that all spins are random?",
        answer: (
            <>
                We use the same framework as outlined in this nerdy research paper on random number generation to ensure that every spin is truly random:{' '}
                <a
                    href="https://www.mdpi.com/2076-3417/10/2/451"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                >
                    https://www.mdpi.com/2076-3417/10/2/451
                </a>
            </>
        )
    }
]

export default function FAQ() {
    return (
        <Card className="w-full max-w-3xl mx-auto border border-gray-400 rounded">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>
                                <div className="text-muted-foreground">
                                    {typeof faq.answer === 'string' ? <p>{faq.answer}</p> : faq.answer}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}