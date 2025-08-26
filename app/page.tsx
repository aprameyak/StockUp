"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Modal,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

interface InventoryItem {
  name: string;
  quantity: number;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const updateInventory = async (): Promise<void> => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList: InventoryItem[] = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      } as InventoryItem);
    });
    setInventory(inventoryList);
  };

  // Add the item
  const addItem = async (item: string): Promise<void> => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, {
        quantity: quantity + 1,
      });
    } else {
      await setDoc(docRef, {
        quantity: 1,
      });
    }
    await updateInventory();
  };

  // Remove the item
  const removeItem = async (item: string): Promise<void> => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
        });
      }
    }
    await updateInventory();
  };

  // Handle photo input
  const handlePhotoInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const itemName = prompt("Enter the name of the item:");
      if (itemName) {
        addItem(itemName);
      }
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);
  const handleSearchToggle = (): void => setIsSearchBarVisible(!isSearchBarVisible);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h2" color="#b905fa">
        Kitchen Pantry
      </Typography>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="White"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          overflow={"auto"}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}></Stack>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName);
              setItemName("");
              handleClose();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Box display={'inline-flex'} gap={5}>
        <Button variant="outlined" onClick={handleOpen}>
          Add New Item
        </Button>
        <Button variant="outlined" onClick={handleSearchToggle}>
          {isSearchBarVisible ? 'Close Search' : 'Search'}
        </Button>
      </Box>
      {isSearchBarVisible && (
        <Box mt={2}>
          <TextField
            variant="outlined"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
          />
        </Box>
      )}
      <Box border="1px solid #333" mt={2}>
        <Box
          width="800px"
          height="100px"
          bgcolor="#b905fa"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              height="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#ebd9fc"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="outlined" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
