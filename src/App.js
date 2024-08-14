import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { ArcherContainer, ArcherElement } from 'react-archer';
import Modal from 'react-modal';
import 'react-resizable/css/styles.css';
import './App.css';

const App = () => {
    const [cards, setCards] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);

    const addCard = () => {
      const cardHeight = 90; // Estimate the height of each card, including padding/margin
      const yOffset = cards.length * cardHeight; // Calculate the y position for the new card

        setCards([
            ...cards,
            {
                id: cards.length,
                title: `Card ${cards.length + 1}`,
                text: `This is randomly some dummy text for Card ${cards.length + 1}. 
                This text is supposed to be longer to demonstrate the "show more" button functionality.
                Hence the button is added at the bottom.`,
                width: 200,
                height: 100,
                x: 0,
                y: yOffset,
            },
        ]);
    };

    const openModal = (card) => {
        setCurrentCard(card);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="app">
            <button onClick={addCard}>Add Card</button>
            <ArcherContainer strokeColor="black">
                <div className="canvas">
                    {cards.map((card, index) => (
                      // dragging starts
                        <Draggable
                            key={card.id}
                            onStop={(e, data) => {
                                const newCards = [...cards];
                                newCards[index].x = data.x;
                                newCards[index].y = data.y;
                                setCards(newCards);
                            }}
                            position={{ x: card.x, y: card.y }}
                            handle=".drag-handle"  // Restrict dragging to a specific area
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    width: card.width,
                                    height: card.height,
                                }}
                            >
                             
                                <ResizableBox
                                    width={card.width}
                                    height={card.height}
                                    minConstraints={[100, 50]}
                                    maxConstraints={[400, 300]}
                                    onResizeStop={(e, data) => {
                                        const newCards = [...cards];
                                        newCards[index].width = data.size.width;
                                        newCards[index].height = data.size.height;
                                        setCards(newCards);
                                    }}
                                    resizeHandles={['se', 'sw', 'ne', 'nw']} // Resize only from corners
                                    className="resizable-box"
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            border: '1px solid #ccc',
                                            backgroundColor: '#f5f5f5',
                                            padding: '10px',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <ArcherElement
                                            id={`card-${card.id}`}
                                            relations={
                                                index > 0
                                                    ? [
                                                          {
                                                              targetId: `card-${
                                                                  card.id - 1
                                                              }`,
                                                              targetAnchor:
                                                                  'middle',
                                                              sourceAnchor:
                                                                  'middle',
                                                              style: {
                                                                  strokeColor:
                                                                      'blue',
                                                                  strokeWidth: 2,
                                                              },
                                                          },
                                                      ]
                                                    : []
                                            }
                                        >
                                            <div className="card-content">
                                                <h3 className="drag-handle">
                                                    {card.title}
                                                </h3>
                                                <p>
                                                    {card.text.slice(0, 50)}...
                                                    <button
                                                        onClick={() =>
                                                            openModal(card)
                                                        }
                                                    >
                                                        Show More
                                                    </button>
                                                </p>
                                            </div>
                                        </ArcherElement>
                                    </div>
                                </ResizableBox>
                            </div>
                        </Draggable>
                    ))}
                </div>
            </ArcherContainer>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>{currentCard?.title}</h2>
                <p>{currentCard?.text}</p>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default App;
