function BasicCard(answer, question){
	if (this instanceof BasicCard) {
        this.type = 'basic';
        this.front = question;
        this.back = answer;
    }
    else {
        return new BasicCard(answer, question);
    }
}

module.exports = BasicCard;
