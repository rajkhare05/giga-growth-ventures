import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function PriceCard({ name, date, closePrice, highPrice, lowPrice, clickHandler }) {

  return (
    <Card className="text-center">
      <Card.Header> { name } ({ date }) </Card.Header>
      <Card.Body>
        <Card.Title> { closePrice } </Card.Title>
        <Card.Text> 🔼 <b>{ highPrice }</b> | 🔽 <b>{ lowPrice }</b> </Card.Text>
        <Button variant="primary" onClick = { () => clickHandler('mail') } > Email </Button>
         &nbsp;
        <Button variant="primary" onClick = { () => clickHandler('whatsapp') } > WhatsApp </Button>
      </Card.Body>
    </Card>
  );
}

