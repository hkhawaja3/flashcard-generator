
function ClozeCard(answer, question) {
    if (this instanceof ClozeCard) {
        this.type = 'cloze';
        this.partial = question.replace(answer, '...');
        this.fullText = question;
        this.cloze = answer;
    } else {
        return new ClozeCard(answer, question);

    }
}

module.exports = ClozeCard;
